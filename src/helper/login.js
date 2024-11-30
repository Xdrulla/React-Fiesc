import { doc, getDoc } from "firebase/firestore";
import { db } from "../service/firebase";

export const checkProfileCompletion = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();

      if (userData.role === "recruiter") {
        return Boolean(userData.phone && userData.company && userData.position);
      }

      if (userData.role === "candidate") {
        return Boolean(
          userData.workExperience &&
          userData.experienceLevel &&
          userData.phone
        );
      }

      console.error(`Role desconhecido para o usuário: ${uid}`);
      return false;
    }

    console.error(`Documento do usuário ${uid} não encontrado no Firestore.`);
    return false;
  } catch (error) {
    console.error(`Erro ao verificar a completude do perfil para ${uid}:`, error);
    return false;
  }
};
