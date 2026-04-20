import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqKDVQx_92gYwHMIKsqOyaFkIAIxaoNmw",
  authDomain: "empresa-horarios.firebaseapp.com",
  databaseURL: "https://empresa-horarios-default-rtdb.firebaseio.com",
  projectId: "empresa-horarios",
  storageBucket: "empresa-horarios.firebasestorage.app",
  messagingSenderId: "110689889357",
  appId: "1:110689889357:web:344586eaa04ced5642c004",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
