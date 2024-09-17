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

export const updateChannel = async ({ id, title, description }) => {
  const updatedData = {
    id: id,
    title: title,
    description: description,
    createdAt: Date.now(),
  };
  await setDoc(doc(getFirestore(), `channels/${id}`), updatedData);
};

export const createMessage = async ({ channelId, message }) => {
  const docRef = doc(
    getFirestore(),
    `channels/${channelId}/messages`,
    message._id
  );
  await setDoc(docRef, { ...message, createdAt: Date.now() });
};
