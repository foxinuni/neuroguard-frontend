import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

export function useEventReadings(patientId, deviceId, crisisId) {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    if (!patientId || !deviceId || !crisisId) return;
    const q = query(
      collection(db, "patients", patientId, "devices", deviceId, "readings"),
      where("crisis_id", "==", crisisId),
      orderBy("timestamp", "asc")
    );
    return onSnapshot(q, (snap) => {
      setReadings(snap.docs.map((d) => d.data()));
    });
  }, [patientId, deviceId, crisisId]);

  return readings;
}
