import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

const DEVICE_TO_PATIENT = {
  esp32_001: "paciente_001",
};

export async function createUserProfile(uid, { displayName, deviceId }) {
  const patientId = DEVICE_TO_PATIENT[deviceId];
  if (!patientId) {
    throw new Error("ID de dispositivo no válido. Verifica e intenta de nuevo.");
  }

  await setDoc(doc(db, "users", uid), {
    patient_id:   patientId,
    device_id:    deviceId,
    display_name: displayName || "",
    created_at:   serverTimestamp(),
  });

  return patientId;
}
