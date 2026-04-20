import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

export function useLatestTelemetry(patientId, deviceId) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!patientId || !deviceId) return;
    const ref = doc(
      db,
      "patients", patientId,
      "devices",  deviceId,
      "latest",   "current"
    );
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) setData(snap.data());
    });
  }, [patientId, deviceId]);

  return data;
}
