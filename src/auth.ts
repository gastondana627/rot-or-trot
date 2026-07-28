import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

// Fallback dummy config so Vite & Vercel build smoothly without needing the missing JSON file
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForChallengeSubmissionOnly",
  authDomain: "rot-or-trot.firebaseapp.com",
  projectId: "rot-or-trot",
  storageBucket: "rot-or-trot.appspot.com",
  messagingSenderId: "100000000000",
  appId: "1:100000000000:web:demokey"
};

// Safely initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

let cachedAccessToken: string | null = "demo-access-token";

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  try {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || "demo-token");
      } else {
        if (onAuthFailure) onAuthFailure();
      }
    });
  } catch (err) {
    console.warn("Auth state observer skipped (Demo Mode active).");
    if (onAuthFailure) onAuthFailure();
  }
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || "demo-token";
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.warn("Google sign-in bypassed or unconfigured for demo environment:", error);
    return null;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  try {
    await auth.signOut();
  } catch (err) {
    console.warn("Logout error skipped.");
  }
  cachedAccessToken = null;
};