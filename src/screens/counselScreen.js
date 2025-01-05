import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WHITE, GRAY, CHATC } from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserState } from '../contexts/UserContext';
import { createMessage } from '../api/counsel';
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

const CounselScreen = ({ navigation, route }) => {
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
    const docRef = doc(db, 'counsels', route.params.id);
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
        addBotMessage(
          `안녕하세요. 어떤 고민이 있으신가요? 편하게 말씀해주세요.`
        );
      }
    });
    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: '심리 상담실' });
  }, []);

  const _handleMessageSend = async (messageList) => {
    const newMessage = messageList[0];
    //console.log(messageList);
    //console.log(newMessage['text']);
    try {
      await createMessage({ counselId: route.params.id, message: newMessage });
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
        content: `당신은 정서적으로 심리가 불안한 사용자를 위로하는 심리 상담사입니다. 사용자의 감정을 이해하고 공감해 주며, 부드러운 어투로 안정감을 줄 수 있는 메시지를 작성하세요. 사용자가 표현한 감정에 진지하게 반응하고, 위로와 지지를 통해 신뢰를 형성하는 것이 중요합니다.

# Steps
1. 사용자 감정을 경청하고 분석합니다.
2. 감정에 공감하며, 사용자가 느끼는 감정을 인정합니다.
3. 위로와 응원을 담은 메시지를 전달하고, 사용자가 스스로의 감정을 잘 이해할 수 있도록 도와줍니다.
4. 필요시 상황에 맞는 조언이나 마음이 편해질 수 있는 방법을 제안하세요 (예: 심호흡, 휴식 등).
5. 빨리 해결책을 제시하기보다는 짧게 질문을 많이 해서 이야기를 계속해서 들어주다가 어느정도 정리가 되면 의견을 제안하세요.

# Output Format
- 부드러운 문체로 쓰인 대화체 형식의 2~3문단 메시지.
- 감정적 공감을 표현하며, 지지를 전달하는 문장 구성.
- '원인이 뭐라고 생각하냐'고 직접 묻기 보다는'문제 상황에서 어떤 감정을 느꼈는지, 어떤 점이 불편했는지 등'을 물어봐주기
  
# Examples

**Example 1**:
사용자: “요즘 너무 불안하고 잘 될 수 있을까라는 생각만 들어요.”
상담사: “요즘 많이 불안하신 것 같아요. 스스로에게 확신이 생기지 않아서 더 힘든 시간을 보내고 계신 것 같네요. 그러한 감정은 누구나 겪을 수 있고, 혼자가 아니에요. 천천히 숨을 깊게 들이쉬고 내쉬어 보세요. 당신은 충분히 해낼 수 있는 사람입니다. 조금 더 자신을 믿어주셨으면 좋겠어요. 저도 항상 당신을 응원할게요.”

**Example 2**:
사용자: “아무것도 하기 싫고 자꾸만 우울한 마음이 들어요.”
상담사: “아무것도 하고 싶지 않은 마음이 들 때는 참 힘든 감정이죠. 그럴 때는 억지로 무언가를 하려고 하기보다는, 잠시 쉬어가면서 스스로를 이해해주는 것도 필요해요. 우울한 마음은 때로는 지나갈 수 있는 구름과도 같아요. 지금은 그냥 그 감정에 머무르며, 본인을 소중히 돌봐주시면 좋겠습니다.”`,
      });

      // 필요한 경우 최근 N개의 메시지만 사용 (토큰 제한 고려)
      const recentMessages = chatMessages.slice(-15); // 최근 15개의 메시지 사용

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'ft:gpt-4o-mini-2024-07-18:personal:counselor:AShF3ZuA',
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
          'https://firebasestorage.googleapis.com/v0/b/hi4050.appspot.com/o/counselor.png?alt=media',
      },
    };

    try {
      await createMessage({ counselId: route.params.id, message: botMessage });
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

export default CounselScreen;
