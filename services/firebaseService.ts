
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc,
  getDoc,
  collection
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { Student } from '../types';

// 注意：請在此處替換為您自己的 Firebase Config
// 您可以在 Firebase Console > 專案設定 > 一般 > 您的應用程式中找到這段資訊
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = 'classroom_data';
const DOCUMENT_ID = 'students_rewards'; // 暫時將所有學生存在一個文檔中，方便管理 28 人規模

export const databaseService = {
  // 監聽學生資料更新
  subscribeToStudents: (onUpdate: (data: Student[]) => void) => {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data().list as Student[]);
      } else {
        // 如果資料庫是空的，則不執行更新，交由 App 初始邏輯處理
        onUpdate([]);
      }
    });
  },

  // 儲存所有學生資料
  saveStudents: async (students: Student[]) => {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    try {
      await setDoc(docRef, { list: students, lastUpdated: new Date() }, { merge: true });
    } catch (error) {
      console.error("Firebase Save Error:", error);
      throw error;
    }
  },

  // 單獨更新特定學生 (更省流量)
  updateStudent: async (studentId: number, students: Student[]) => {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await updateDoc(docRef, { list: students });
  }
};
