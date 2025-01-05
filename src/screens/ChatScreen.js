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
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';
//import Clipboard from '@react-native-clipboard/clipboard';

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
  const { top, bottom } = useSafeAreaInsets();
  const name = user.displayName;
  //console.log(user.photoURL);
  const { showActionSheetWithOptions } = useActionSheet();
  const navigationto = useNavigation();

  const onPressBubble = (currentMessage) => {
    const options = ['신고하기', '복사하기', '취소'];
    const CANCEL_INDEX = 2;
    const DESTRUCTIVE_INDEX = 0;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        destructiveColor: '#ff0000',
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            if (currentMessage) {
              navigationto.navigate(MainRoutes.REPORT, { currentMessage });
              //console.log(currentMessage);
            }
            break;
          case 1:
            if (currentMessage) {
              Clipboard.setString(currentMessage);
            }
            break;
          default:
            break;
        }
      }
    );
  };

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
      // [대화의 맥락을 유지하는 챗봇으로 변경] 현재까지의 대화 메시지를 ChatGPT 형식으로 변환
      const chatMessages = messages
        .map((msg) => {
          return {
            role: msg.user._id === user.uid ? 'user' : 'assistant',
            content: msg.text,
          };
        })
        .reverse(); // 시간 순서대로 정렬 (과거 -> 현재)

      // 새로운 사용자 메시지를 추가
      chatMessages.push({ role: 'user', content: message });

      // 시스템 메시지를 맨 앞에 추가 (옵션)
      chatMessages.unshift({
        role: 'system',
        content: `당신의 이름은 ${route.params.title}이고, ${route.params.description}, 대화형식으로 답해주세요.`,
      });

      // 필요한 경우 최근 N개의 메시지만 사용 (토큰 제한 고려)
      const recentMessages = chatMessages.slice(-15); // 최근 15개의 메시지 사용

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: recentMessages,
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
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
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
        //isTyping
        //onPress={onPressBubble}
        onLongPress={(context, message) => onPressBubble(message.text)}
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
