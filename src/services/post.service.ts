import { db, storage } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  orderBy, 
  limit 
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

      if (file) {
        const storageRef = ref(storage, `posts/${userId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(snapshot.ref);
      }

      const docRef = await addDoc(collection(db, "posts"), {
        userId,
        projectId,
        caption: postData.caption || "",
        mediaUrl,
        platforms: postData.platforms || [],
        status: postData.status || "draft",
        scheduledAt: postData.scheduledAt || serverTimestamp(),
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        shares: 0,
      });

      const postId = docRef.id;

      let mediaType = (file ? file.type : postData.mediaType) || 'image';
      if (mediaUrl) {
        await addDoc(collection(db, "post_media"), {
          postId,
          projectId,
          url: mediaUrl,
          type: mediaType,
          createdAt: serverTimestamp()
        });
      }

      const targetRefs: Record<string, any> = {};

      const accounts = await socialAccountService.getAccountsByProject(projectId);
      if (postData.platforms && postData.platforms.length > 0) {
        for (const platform of postData.platforms) {
          const accs = accounts.filter(a => a.platform === platform && a.status === "active");
          for (const acc of accs) {
            const tempRef = await addDoc(collection(db, "post_targets"), {
              postId,
              projectId,
              platform,
              accountId: acc.id,
              status: postData.status || "draft",
              createdAt: serverTimestamp()
            });
            targetRefs[acc.id] = tempRef;
          }
        }
      }

      const actionStatus = postData.status === 'published' ? 'success' : postData.status === 'scheduled' ? 'scheduled' : 'info';

      await logService.createLog({
        userId,
        projectId,
        action: `post_${postData.status || 'draft'}`,
        platform: postData.platforms?.[0] || "system",
        status: actionStatus
      });

      // Auto-publish to Telegram if status is published
      if (postData.status === "published" && postData.platforms?.includes("telegram")) {
        try {
          const tgAccounts = accounts.filter(a => a.platform === "telegram" && a.status === "active");
          const isVideo = mediaType.startsWith('video/');
          
          for (const tg of tgAccounts) {
            const target = tg.chatId || tg.accountId;
            if (tg.accessToken && target) {
              try {
                let tgResponse;
                if (mediaUrl) {
                  if (isVideo) {
                    tgResponse = await telegramService.sendVideo(tg.accessToken, target, mediaUrl, postData.caption);
                  } else {
                    tgResponse = await telegramService.sendPhoto(tg.accessToken, target, mediaUrl, postData.caption);
                  }
                } else if (postData.caption) {
                  tgResponse = await telegramService.sendText(tg.accessToken, target, postData.caption);
                }

                if (targetRefs[tg.id]) {
                  await updateDoc(targetRefs[tg.id], {
                    status: "published",
                    response: tgResponse,
                    publishedAt: serverTimestamp()
                  });
                }

                await logService.createLog({
                  userId,
                  projectId,
                  action: `Published to Telegram (${tg.accountName})`,
                  platform: "telegram",
                  status: "success"
                });
              } catch (publishErr: any) {
                console.error("Telegram publish error:", publishErr);
                
                if (targetRefs[tg.id]) {
                  await updateDoc(targetRefs[tg.id], {
                    status: "failed",
                    error: publishErr.message,
                    failedAt: serverTimestamp()
                  });
                }

                await logService.createLog({
                  userId,
                  projectId,
                  action: `Failed to publish to Telegram (${tg.accountName})`,
                  platform: "telegram",
                  status: "failed"
                });
              }
            }
          }
        } catch (tgError: any) {
          console.error("Telegram publish error:", tgError);
        }
      }

      // Auto-publish to Instagram if status is published
      if (postData.status === "published" && postData.platforms?.includes("instagram")) {
        try {
          const igAccounts = accounts.filter(a => a.platform === "instagram" && a.status === "active");
          const isVideo = mediaType.startsWith('video/');
          
          for (const ig of igAccounts) {
            // Instagram requires mediaUrl
            if (ig.accessToken && ig.accountId && mediaUrl) {
              try {
                // Phase 1: Create Container
                const containerId = await instagramService.createMediaContainer(
                  ig.accountId,
                  ig.accessToken,
                  mediaUrl,
                  postData.caption || "",
                  isVideo ? 'video' : 'image'
                );

                // Phase 2: Wait if video, or just check once if image
                const isReady = await instagramService.waitForContainer(containerId, ig.accessToken);
                
                if (!isReady) {
                  throw new Error("Media container timed out or failed to process.");
                }

                // Phase 3: Publish
                const igResponse = await instagramService.publishMedia(ig.accountId, ig.accessToken, containerId);

                if (targetRefs[ig.id]) {
                  await updateDoc(targetRefs[ig.id], {
                    status: "published",
                    response: { containerId, postId: igResponse },
                    publishedAt: serverTimestamp()
                  });
                }

                await logService.createLog({
                  userId,
                  projectId,
                  action: `Published to Instagram (${ig.accountName})`,
                  platform: "instagram",
                  status: "success"
                });
              } catch (publishErr: any) {
                console.error("Instagram publish error:", publishErr);
                
                if (targetRefs[ig.id]) {
                  await updateDoc(targetRefs[ig.id], {
                    status: "failed",
                    error: publishErr.message,
                    failedAt: serverTimestamp()
                  });
                }

                await logService.createLog({
                  userId,
                  projectId,
                  action: `Failed to publish to Instagram (${ig.accountName})`,
                  platform: "instagram",
                  status: "failed"
                });
              }
            }
          }
        } catch (igError: any) {
          console.error("Instagram publish generic error:", igError);
        }
      }

      return postId;
    } catch (error) {
      console.error("Error creating post:", error);
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
        projectId: "system", // default to system if unknown
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
