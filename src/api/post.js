import {
  collection,
  getFirestore,
  doc,
  setDoc,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  where,
  deleteDoc,
  updateDoc,
  increment,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';

export const createPost = async ({ photos, location, text, user }) => {
  try {
    const { uid, displayName, photoURL } = user;
    const collectionRef = collection(getFirestore(), 'posts');
    const documentRef = doc(collectionRef);
    const id = documentRef.id;
    await setDoc(documentRef, {
      id,
      photos,
      location,
      text,
      user: { uid, displayName, photoURL },
      createdTs: Date.now(),
      alert: 0, // 신고 횟수 초기화
    });
  } catch (e) {
    console.log('createPost error: ', e);
    throw new Error('글 작성 실패');
  }
};

// 신고 기능 - alert 필드를 증가시킴
export const reportPost = async (postId) => {
  try {
    const postRef = doc(getFirestore(), `posts/${postId}`);
    await updateDoc(postRef, {
      alert: increment(1), // 신고 횟수 증가
    });
    console.log('Post reported successfully');
  } catch (e) {
    console.log('reportPost error: ', e);
    throw new Error('신고 실패');
  }
};

// 다른 사용자 차단 기능
export const blockUser = async (currentUserId, targetUserId) => {
  try {
    const userRef = doc(getFirestore(), `users/${currentUserId}`);
    await updateDoc(userRef, {
      blockedUsers: arrayUnion(targetUserId), // 차단할 사용자 추가
    });
    console.log(`User ${targetUserId} blocked by ${currentUserId}`);
  } catch (e) {
    console.log('blockUser error: ', e);
    throw new Error('사용자 차단 실패');
  }
};

const getBlockedUsers = async (userId) => {
  const userRef = doc(getFirestore(), `users/${userId}`);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().blockedUsers || [] : [];
};

const getOption = ({ after, isMyPost, uid }) => {
  const collectionRef = collection(getFirestore(), 'posts');

  if (isMyPost) {
    return after
      ? query(
          collectionRef,
          where('user.uid', '==', uid),
          orderBy('createdTs', 'desc'),
          startAfter(after),
          limit(10)
        )
      : query(
          collectionRef,
          where('user.uid', '==', uid),
          orderBy('createdTs', 'desc'),
          limit(10)
        );
  } else {
    return after
      ? query(
          collectionRef,
          orderBy('createdTs', 'desc'),
          startAfter(after),
          limit(10)
        )
      : query(collectionRef, orderBy('createdTs', 'desc'), limit(10));
  }
};

export const getPosts = async ({ after, isMyPost, uid }) => {
  const blockedUsers = await getBlockedUsers(uid); // 차단된 사용자 목록 가져오기
  // 모든 게시물 가져오기 (차단된 사용자 필터링 없이)
  const collectionRef = collection(getFirestore(), 'posts');
  const baseQuery = query(
    collectionRef,
    orderBy('createdTs', 'desc'),
    limit(10 + blockedUsers.length) // 차단된 사용자의 게시물을 제외하고 10개를 얻기 위해 추가로 가져옴
  );
  //const option = getOption({ after, isMyPost, uid, blockedUsers });
  const option = after ? query(baseQuery, startAfter(after)) : baseQuery;

  const documentSnapshot = await getDocs(option);
  //const list = documentSnapshot.docs.map((doc) => doc.data());
  const allPosts = documentSnapshot.docs.map((doc) => doc.data());

  // 클라이언트 측에서 차단된 사용자의 게시물 필터링
  const list = allPosts
    .filter((post) => !blockedUsers.includes(post.user.uid))
    .slice(0, 10); // 최대 10개의 게시물만 사용

  const last = documentSnapshot.docs[documentSnapshot.docs.length - 1];

  return { list, last };
};

export const deletePost = async (id) => {
  await deleteDoc(doc(getFirestore(), `posts/${id}`));
};

export const updatePost = async (post) => {
  try {
    await setDoc(doc(getFirestore(), `posts/${post.id}`), post);
  } catch (e) {
    console.log('updatePost error: ', e);
    throw new Error('글 수정 실패');
  }
};

export const getPostsByLocation = async ({ after, location }) => {
  const collectionRef = collection(getFirestore(), 'posts');

  const option = after
    ? query(
        collectionRef,
        where('location', '==', location),
        orderBy('createdTs', 'desc'),
        startAfter(after),
        limit(10)
      )
    : query(
        collectionRef,
        where('location', '==', location),
        orderBy('createdTs', 'desc'),
        limit(10)
      );

  const documentSnapshot = await getDocs(option);
  const list = documentSnapshot.docs.map((doc) => doc.data());
  const last = documentSnapshot.docs[documentSnapshot.docs.length - 1];

  return { list, last };
};
