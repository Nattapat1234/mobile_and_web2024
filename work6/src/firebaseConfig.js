import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAyzmm3IfRt1qnGuWSgByQZpPQsjuZhgRs",
    authDomain: "web2567-e78bf.firebaseapp.com",
    projectId: "web2567-e78bf",
    storageBucket: "web2567-e78bf.firebasestorage.app",
    messagingSenderId: "121954655901",
    appId: "1:121954655901:web:0df5933f118a647a81be74",
    measurementId: "G-P17451J8TF"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
