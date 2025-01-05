import { collection, getFirestore, doc, setDoc } from 'firebase/firestore';

export const saveReport = async ({ uid, content }) => {
  const collectionRef = collection(getFirestore(), 'reports');
  const newCounselRef = doc(collectionRef);
  const id = newCounselRef.id;
  const newCounsel = {
    id,
    uid,
    content,
    createdAt: Date.now(),
  };
  await setDoc(newCounselRef, newCounsel);
  return id;
};
