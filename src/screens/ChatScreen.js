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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  orderBy,
} from 'firebase/firestore';
import axios from 'axios';
import { OPENAI_API_KEY } from '../../env';

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
      <MaterialCommunityIcons
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

      if (list.length) {
        setMessages(list);
      } else {
        // 초기 AI 메시지 설정
        addBotMessage(`안녕하세요. 저는 ${route.params.title}입니다.`);
      }
    });
    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: route.params.title || '대화방' });
  }, []);

  const _handleMessageSend = async (messageList) => {
    const newMessage = messageList[0];
    //console.log(messageList);
    //console.log(newMessage['text']);
    try {
      await createMessage({ channelId: route.params.id, message: newMessage });
      sendMessageToChatGPT(newMessage['text']);
    } catch (e) {
      Alert.alert('Send Message Error', e.message);
    }
  };

  // ChatGPT API에 메시지 보내기
  const sendMessageToChatGPT = async (message) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `당신의 이름은 ${route.params.title}이고, ${route.params.description}, 대화형식으로 답해주세요.`,
            },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const botMessage = response.data.choices[0].message.content.trim();

      // ChatGPT의 응답을 메시지 목록에 추가
      addBotMessage(botMessage);
    } catch (error) {
      console.error('Error sending message to ChatGPT:', error);
    }
  };

  // ChatGPT의 메시지를 UI에 추가하는 함수
  const addBotMessage = async (text) => {
    const botMessage = {
      _id: Math.random().toString(),
      text,
      createdAt: new Date(),
      user: {
        _id: 'N1YdtnWb9ThxssEhzuj3WEPN1Wh1',
        name: route.params.title,
        avatar:
          'https://firebasestorage.googleapis.com/v0/b/hi4050.appspot.com/o/chatgpt.png?alt=media',
      },
    };

    try {
      await createMessage({ channelId: route.params.id, message: botMessage });
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
