import { collection, getFirestore, setDoc, doc } from 'firebase/firestore';

export const saveTests = async (stests) => {
  try {
    /** 
    const collectionRef = collection(getFirestore(), 'stests');
    const documentRef = doc(collectionRef);
    const id = documentRef.id;
    await setDoc(documentRef, {
      id,
      uid,
      stests,
      createdTs: Date.now(),
    });
    **/
    const docRef = doc(getFirestore(), 'stests');
    await setDoc(docRef, { stests, createdAt: Date.now() });
  } catch (e) {
    console.log('saveTests error: ', e);
    throw new Error('저장 실패');
  }
};
