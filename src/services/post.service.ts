import { db, storage } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  orderBy, 
  limit,
  Timestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Post } from "@/types";
import { logService } from "./log.service";
import { socialAccountService } from "./socialAccount.service";
import { telegramService } from "./telegram.service";
import { instagramService } from "./instagram.service";

export const postService = {
  async createPost(userId: string, projectId: string, postData: Partial<Post>, file?: File): Promise<string> {
    try {
      let mediaUrl = postData.mediaUrl || "";
      let mediaType = postData.mediaType || 'image';

      if (file) {
        const storageRef = ref(storage, `posts/${userId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(snapshot.ref);
        mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      }

      const docRef = await addDoc(collection(db, "posts"), {
        userId,
        projectId,
        caption: postData.caption || "",
        mediaUrl,
        mediaType,
        platforms: postData.platforms || [],
        status: postData.status || "draft",
        scheduledAt: postData.scheduledAt || serverTimestamp(),
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        shares: 0,
      });

      const postId = docRef.id;

      if (mediaUrl) {
        await addDoc(collection(db, "post_media"), {
          postId,
          projectId,
          url: mediaUrl,
          type: mediaType,
          createdAt: serverTimestamp()
        });
      }

      const accounts = await socialAccountService.getAccountsByProject(projectId);
      if (postData.platforms && postData.platforms.length > 0) {
        for (const platform of postData.platforms) {
          const accs = accounts.filter(a => a.platform === platform && a.status === "active");
          for (const acc of accs) {
            await addDoc(collection(db, "post_targets"), {
              postId,
              projectId,
              platform,
              accountId: acc.id,
              status: postData.status || "draft",
              createdAt: serverTimestamp()
            });
          }
        }
      }

      await logService.createLog({
        userId,
        projectId,
        action: `post_${postData.status || 'draft'}`,
        platform: postData.platforms?.[0] || "system",
        status: postData.status === 'published' ? 'success' : postData.status === 'scheduled' ? 'scheduled' : 'info'
      });

      // Auto-publish if status is published
      if (postData.status === "published") {
        await this.publishPost(postId);
      }

      return postId;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  async publishPost(postId: string): Promise<void> {
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) throw new Error("Post not found");
      const postData = postSnap.data() as Post;

      const { userId, projectId, caption, mediaUrl, mediaType, platforms } = postData;
      const accounts = await socialAccountService.getAccountsByProject(projectId);

      // Fetch targets to update them later
      const targetsQuery = query(collection(db, "post_targets"), where("postId", "==", postId));
      const targetsSnap = await getDocs(targetsQuery);
      const targetRefs: Record<string, string> = {};
      targetsSnap.docs.forEach(d => {
        targetRefs[d.data().accountId] = d.id;
      });

      // 1. Telegram Publishing
      if (platforms.includes("telegram")) {
        const tgAccounts = accounts.filter(a => a.platform === "telegram" && a.status === "active");
        const isVideo = mediaType?.startsWith('video/');
        
        for (const tg of tgAccounts) {
          const target = tg.chatId || tg.accountId;
          if (tg.accessToken && target) {
            try {
              let tgResponse;
              if (mediaUrl) {
                tgResponse = isVideo 
                  ? await telegramService.sendVideo(tg.accessToken, target, mediaUrl, caption)
                  : await telegramService.sendPhoto(tg.accessToken, target, mediaUrl, caption);
              } else if (caption) {
                tgResponse = await telegramService.sendText(tg.accessToken, target, caption);
              }

              if (targetRefs[tg.id]) {
                await updateDoc(doc(db, "post_targets", targetRefs[tg.id]), {
                  status: "published",
                  response: tgResponse,
                  publishedAt: serverTimestamp()
                });
              }
            } catch (err: any) {
              console.error("Telegram publish fail:", err);
              if (targetRefs[tg.id]) {
                await updateDoc(doc(db, "post_targets", targetRefs[tg.id]), {
                  status: "failed",
                  error: err.message
                });
              }
            }
          }
        }
      }

      // 2. Instagram Publishing
      if (platforms.includes("instagram")) {
        const igAccounts = accounts.filter(a => a.platform === "instagram" && a.status === "active");
        const isVideo = mediaType?.startsWith('video/');

        for (const ig of igAccounts) {
          if (ig.accessToken && ig.accountId && mediaUrl) {
            try {
              const containerId = await instagramService.createMediaContainer(
                ig.accountId, ig.accessToken, mediaUrl, caption || "", isVideo ? 'video' : 'image'
              );
              const isReady = await instagramService.waitForContainer(containerId, ig.accessToken);
              if (!isReady) throw new Error("Instagram processing timeout");

              const igResponse = await instagramService.publishMedia(ig.accountId, ig.accessToken, containerId);

              if (targetRefs[ig.id]) {
                await updateDoc(doc(db, "post_targets", targetRefs[ig.id]), {
                  status: "published",
                  response: { containerId, postId: igResponse },
                  publishedAt: serverTimestamp()
                });
              }
            } catch (err: any) {
              console.error("Instagram publish fail:", err);
              if (targetRefs[ig.id]) {
                await updateDoc(doc(db, "post_targets", targetRefs[ig.id]), {
                  status: "failed",
                  error: err.message
                });
              }
            }
          }
        }
      }

      // Update main post status
      await updateDoc(postRef, {
        status: "published",
        publishedAt: serverTimestamp()
      });

    } catch (error: any) {
      console.error("Publishing process error:", error);
      await updateDoc(doc(db, "posts", postId), { status: "failed" });
    }
  },

  async processScheduledPosts(): Promise<number> {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, "posts"),
        where("status", "==", "scheduled"),
        where("scheduledAt", "<=", now)
      );
      
      const querySnapshot = await getDocs(q);
      let count = 0;

      for (const postDoc of querySnapshot.docs) {
        await this.publishPost(postDoc.id);
        count++;
      }

      if (count > 0) {
        console.log(`Processed ${count} scheduled posts.`);
      }
      
      return count;
    } catch (error) {
      console.error("Error processing scheduled posts:", error);
      throw error;
    }
  },

  async updatePost(userId: string, postId: string, postData: Partial<Post>): Promise<void> {
    try {
      const docRef = doc(db, "posts", postId);
      await updateDoc(docRef, {
        ...postData,
        updatedAt: serverTimestamp(),
      });
      await logService.createLog({
        userId,
        projectId: postData.projectId || "",
        action: `post_update${postData.status ? `_to_${postData.status}` : ''}`,
        platform: postData.platforms?.[0] || "system",
        status: postData.status === 'published' ? 'success' : postData.status === 'scheduled' ? 'scheduled' : postData.status === 'failed' ? 'failed' : 'info'
      });
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  async deletePost(userId: string, postId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "posts", postId));
      await logService.createLog({
        userId,
        projectId: "system",
        action: "post_deletion",
        platform: "system",
        status: "info"
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
};

