import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WHITE, GRAY, CHATC } from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserState } from '../contexts/UserContext';
import { createMessage } from '../api/chat';
import { Alert, Image } from 'react-native';
import {
  GiftedChat,
  Send,
  InputToolbar,
  Bubble,
  Day,
} from 'react-native-gifted-chat';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  orderBy,
} from 'firebase/firestore';

const SendButton = (props) => {
  return (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
      }}
    >
      <MaterialIcons
        name="send"
        size={24}
        color={props.text ? GRAY.DARK : GRAY.LIGHT}
      />
    </Send>
  );
};

const renderInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 2,
        margin: 5,
        borderRadius: 20,
        borderColor: CHATC.DARK,
        backgroundColor: WHITE,
      }}
    />
  );
};

const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: CHATC.DEFAULT,
          borderBottomRightRadius: 0,
        },
        left: {
          backgroundColor: CHATC.LIGHT,
          borderBottomLeftRadius: 0,
        },
      }}
      textStyle={{
        right: {
          color: '#000',
        },
        left: {
          color: '#000',
        },
      }}
      timeTextStyle={{
        left: { color: GRAY.DARK },
        right: { color: GRAY.DARK },
      }}
      renderUsernameOnMessage={false}
    />
  );
};

const ChatScreen = ({ navigation, route }) => {
  const [user, setUser] = useUserState();
  const [messages, setMessages] = useState([]);
  const { top } = useSafeAreaInsets();
  const name = user.displayName;
  //console.log(user.photoURL);
  const db = getFirestore();
  useEffect(() => {
    const docRef = doc(db, 'channels', route.params.id);
    const collectionQuery = query(
      collection(db, `${docRef.path}/messages`),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setMessages(list);
    });
    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: route.params.title || 'Channel' });
  }, []);

  const _handleMessageSend = async (messageList) => {
    const newMessage = messageList[0];
    try {
      await createMessage({ channelId: route.params.id, message: newMessage });
    } catch (e) {
      Alert.alert('Send Message Error', e.message);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <GiftedChat
        listViewProps={{
          style: { backgroundColor: CHATC.DARK },
        }}
        placeholder="메시지..."
        messages={messages}
        user={{ _id: user.uid, name, avatar: user.photoURL }}
        onSend={_handleMessageSend}
        alwaysShowSend={true}
        renderAvatar={(props) => (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: props.currentMessage.user.avatar }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            {props.currentMessage.user.name && (
              <Text style={{ color: GRAY.DARK }}>
                {props.currentMessage.user.name}
              </Text>
            )}
          </View>
        )}
        renderDay={(props) => (
          <Day {...props} textStyle={{ color: GRAY.DARK }} />
        )}
        textInputProps={{
          autoCapitalize: 'none',
          autoCorrect: false,
          textContentType: 'none', // iOS only
          underlineColorAndroid: 'transparent', // Android only
        }}
        isTyping
        dateFormat={'YYYY년 M월 D일'}
        multiline={true}
        renderUsernameOnMessage={true}
        scrollToBottom={true}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={(props) => <SendButton {...props} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CHATC.DARK,
  },
});

export default ChatScreen;
