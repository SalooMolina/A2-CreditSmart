// src/firebase/requests.service.js
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createRequest = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "solicitudes"), data);
    return docRef.id;
  } catch (error) {
    throw new Error("Error al guardar solicitud: " + error.message);
  }
};

export const updateRequest = async (id, data) => {
  try {
    const ref = doc(db, "solicitudes", id);
    await updateDoc(ref, data);
    return true;
  } catch (error) {
    throw new Error("Error al actualizar solicitud: " + error.message);
  }
};

export const deleteRequest = async (id) => {
  try {
    const ref = doc(db, "solicitudes", id);
    await deleteDoc(ref);
    return true;
  } catch (error) {
    throw new Error("Error al eliminar solicitud: " + error.message);
  }
};
