// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Configuración que te da Firebase en la consola
const firebaseConfig = {
  apiKey: "AIzaSyAb6mVe4h9SrJxx4XXefOFMlY3kSLHNUXs",
  authDomain: "a3-creditsmart.firebaseapp.com",
  projectId: "a3-creditsmart",
  storageBucket: "a3-creditsmart.firebasestorage.app",
  messagingSenderId: "859299357716",
  appId: "1:859299357716:web:9fba1cc5382034bd26b301"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);


// Exportar la base de datos
export const db = getFirestore(app);