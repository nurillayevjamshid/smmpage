import { schedule } from "@netlify/functions";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

// Reuse the Firebase config or get from environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Skeletons for the publishing services (for the function)
// In a real app, these would be in a shared library
const publishToTelegram = async (acc: any, caption: string, mediaUrl: string, mediaType: string) => {
    // Basic fetch implementation for the function context
    const token = acc.accessToken;
    const chat_id = acc.chatId || acc.accountId;
    const isVideo = mediaType?.startsWith('video/');
    
    if (mediaUrl) {
        const method = isVideo ? 'sendVideo' : 'sendPhoto';
        const field = isVideo ? 'video' : 'photo';
        const url = `https://api.telegram.org/bot${token}/${method}`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: mediaUrl, chat_id, caption })
        });
    } else {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: caption, chat_id })
        });
    }
};

const publishToInstagram = async (acc: any, caption: string, mediaUrl: string, mediaType: string) => {
    // Minimal IG Graph API implementation for the function
    const token = acc.accessToken;
    const igId = acc.accountId;
    const isVideo = mediaType?.startsWith('video/');
    const baseUrl = 'https://graph.facebook.com/v19.0';
    
    // 1. Create Container
    const params: any = { access_token: token, caption };
    if (isVideo) {
        params.video_url = mediaUrl;
        params.media_type = 'VIDEO';
    } else {
        params.image_url = mediaUrl;
    }
    
    const containerRes = await fetch(`${baseUrl}/${igId}/media?` + new URLSearchParams(params), { method: 'POST' });
    const containerData = await containerRes.json();
    if (!containerRes.ok) throw new Error(containerData.error?.message || 'IG Container Failed');
    
    const containerId = containerData.id;
    
    // 2. Wait (simple delay for function, in real app poll more robustly)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 3. Publish
    const publishRes = await fetch(`${baseUrl}/${igId}/media_publish?creation_id=${containerId}&access_token=${token}`, { method: 'POST' });
    const publishData = await publishRes.json();
    if (!publishRes.ok) throw new Error(publishData.error?.message || 'IG Publish Failed');
    
    return publishData.id;
};

const handler = async (event: any) => {
  console.log("Processing scheduled posts trigger...");
  
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
      const postId = postDoc.id;
      const data = postDoc.data();
      
      try {
        // Fetch project accounts
        const accountsQuery = query(collection(db, "social_accounts"), where("projectId", "==", data.projectId));
        const accountsSnap = await getDocs(accountsQuery);
        const accounts = accountsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Fetch targets
        const targetsQuery = query(collection(db, "post_targets"), where("postId", "==", postId));
        const targetsSnap = await getDocs(targetsQuery);
        
        for (const targetDoc of targetsSnap.docs) {
          const target = targetDoc.data();
          const acc = accounts.find(a => a.id === target.accountId);
          
          if (acc && (acc as any).status === "active") {
            try {
              if (target.platform === "telegram") {
                await publishToTelegram(acc, data.caption, data.mediaUrl, data.mediaType);
              } else if (target.platform === "instagram") {
                await publishToInstagram(acc, data.caption, data.mediaUrl, data.mediaType);
              }

              await updateDoc(doc(db, "post_targets", targetDoc.id), {
                status: "published",
                publishedAt: serverTimestamp()
              });
            } catch (pErr: any) {
              console.error(`Error publishing target ${targetDoc.id}:`, pErr);
              await updateDoc(doc(db, "post_targets", targetDoc.id), {
                status: "failed",
                error: pErr.message
              });
            }
          }
        }

        // Finalize post
        await updateDoc(doc(db, "posts", postId), {
          status: "published",
          publishedAt: serverTimestamp()
        });
        count++;
        
      } catch (err) {
        console.error(`Post ${postId} processing failed:`, err);
        await updateDoc(doc(db, "posts", postId), { status: "failed" });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Successfully processed ${count} posts.` }),
    };
  } catch (error: any) {
    console.error("Main Schedule Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Export as both a regular function and a scheduled one
// Run every 10 minutes (* / 10 is usually supported in Netlify Cron)
export const scheduledHandler = schedule("*/10 * * * *", handler);
export { handler };
