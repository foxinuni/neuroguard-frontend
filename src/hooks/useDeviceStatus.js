import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

export function useDeviceStatus(deviceId) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!deviceId) return;
    return onSnapshot(doc(db, "devices", deviceId), (snap) => {
      if (snap.exists()) setStatus(snap.data());
    });
  }, [deviceId]);

  return status;
}
