import { collection, getFirestore, doc, setDoc } from 'firebase/firestore';

export const createChannel = async ({ title, description }) => {
  const collectionRef = collection(getFirestore(), 'channels');
  const newChannelRef = doc(collectionRef);
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description,
    createdAt: Date.now(),
  };
  await setDoc(newChannelRef, newChannel);
  return id;
};

export const createMessage = async ({ channelId, message }) => {
  const docRef = doc(
    getFirestore(),
    `channels/${channelId}/messages`,
    message._id
  );
  await setDoc(docRef, { ...message, createdAt: Date.now() });
};