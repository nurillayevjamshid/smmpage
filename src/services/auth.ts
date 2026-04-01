import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser,
  GoogleAuthProvider
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await createUserIfNotExists(user);
    return user;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export const createUserIfNotExists = async (user: FirebaseUser) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const isAdmin = user.email === "kayaove@gmail.com"; // Updated Admin email

  if (!userSnap.exists()) {
    const newUser = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "New User",
      photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random`,
      role: isAdmin ? "Admin" : "SMM Manager",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, newUser);
    return newUser;
  } else {
    // Optionally update user data
    const updateData = {
      updatedAt: serverTimestamp(),
      photoURL: user.photoURL || userSnap.data().photoURL,
    };
    await setDoc(userRef, updateData, { merge: true });
    return { ...userSnap.data(), ...updateData };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
