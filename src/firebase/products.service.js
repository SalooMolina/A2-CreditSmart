// src/firebase/products.service.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error("Error al cargar productos: " + error.message);
  }
};