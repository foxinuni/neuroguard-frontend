import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [patientId, setPatientId]     = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) {
          setPatientId(snap.data().patient_id);
          setDisplayName(snap.data().display_name || firebaseUser.displayName || "");
        } else {
          setPatientId(null);
          setDisplayName(firebaseUser.displayName || "");
        }
      } else {
        setUser(null);
        setPatientId(null);
        setDisplayName(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = () => signOut(auth);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (snap.exists()) {
      setPatientId(snap.data().patient_id);
      setDisplayName(snap.data().display_name || auth.currentUser.displayName || "");
    }
  };

  return (
    <AuthContext.Provider value={{ user, patientId, displayName, loading, logout, loginWithGoogle, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
