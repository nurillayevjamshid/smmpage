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

      await logService.createLog({
        userId,
        projectId,
        action: "post_creation",
        platform: postData.platforms?.[0] || "system",
        status: "success"
      });

      // Auto-publish to Telegram if status is published
      if (postData.status === "published" && postData.platforms?.includes("telegram")) {
        try {
          const accounts = await socialAccountService.getAccountsByProject(projectId);
          const tgAccounts = accounts.filter(a => a.platform === "telegram" && a.status === "active");
          const isVideo = file?.type.startsWith('video/');
          
          for (const tg of tgAccounts) {
            const target = tg.chatId || tg.accountId;
            if (tg.accessToken && target) {
              if (mediaUrl) {
                if (isVideo) {
                  await telegramService.sendVideo(tg.accessToken, target, mediaUrl, postData.caption);
                } else {
                  await telegramService.sendPhoto(tg.accessToken, target, mediaUrl, postData.caption);
                }
              } else if (postData.caption) {
                await telegramService.sendText(tg.accessToken, target, postData.caption);
              }
            }
          }
        } catch (tgError) {
          console.error("Telegram publish error:", tgError);
        }
      }

      return docRef.id;
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
        action: "post_update",
        platform: postData.platforms?.[0] || "system",
        status: "success"
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
        projectId: "",
        action: "post_deletion",
        platform: "system",
        status: "success"
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
};
