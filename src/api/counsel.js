import { collection, getFirestore, doc, setDoc } from 'firebase/firestore';

export const createCounsel = async ({ id, title, description }) => {
  const collectionRef = collection(getFirestore(), 'counsels');
  const newCounselRef = doc(collectionRef, id); // 전달받은 id를 사용
  const newCounsel = {
    id,
    title,
    description,
    createdAt: Date.now(),
  };
  await setDoc(newCounselRef, newCounsel);
  return id;
};

export const updateCounsel = async ({ id, title, description }) => {
  const updatedData = {
    id: id,
    title: title,
    description: description,
    createdAt: Date.now(),
  };
  await setDoc(doc(getFirestore(), `counsels/${id}`), updatedData);
};

export const createMessage = async ({ counselId, message }) => {
  const docRef = doc(
    getFirestore(),
    `counsels/${counselId}/messages`,
    message._id
  );
  await setDoc(docRef, { ...message, createdAt: Date.now() });
};
