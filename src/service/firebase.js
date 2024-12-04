import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBDnjkMAO0wOM9_ct3kPe9t5dbQ5aENUNI",
  authDomain: "corporate-fiesc.firebaseapp.com",
  projectId: "corporate-fiesc",
  storageBucket: "corporate-fiesc.firebasestorage.app",
  messagingSenderId: "527393557551",
  appId: "1:527393557551:web:4aa29f9adb003c5f544ada"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistência configurada para sessão.")
  })
  .catch((error) => {
    console.error("Erro ao configurar persistência:", error)
  })