import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
             // Admin email check (kayaove@gmail.com)
             const isAdmin = firebaseUser.email === "kayaove@gmail.com";

            const newUser = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || "User")}&background=random`,
              role: isAdmin ? "Admin" : "SMM Manager",
              createdAt: serverTimestamp(),
            };
            await setDoc(userRef, newUser);
            setUser({ ...newUser, isAdmin });
          } else {
            const data = userSnap.data();
            setUser({ id: firebaseUser.uid, ...data, isAdmin: data.role === "Admin" });
          }
        } catch (error) {
          console.error("Auth error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return { user, loading, logout, isAdmin: user?.role === "Admin" };
}
