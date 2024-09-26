import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Animated,
  Alert,
  TextInput,
} from 'react-native';
import cards from '../components/TarotCards';
import axios from 'axios';
import { SAJU_API_KEY } from '../../env';
import Markdown from 'react-native-markdown-display';
import Button from '../components/Button';

const TarotCardScreen = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  // 애니메이션 값 생성
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  const animateCards = () => {
    Animated.stagger(500, [
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getInterpretation = async (cardsToInterpret) => {
    try {
      setLoading(true);
      const positions = ['과거', '현재', '미래'];
      const cardDescriptions = cardsToInterpret
        .map((card, index) => {
          const position = positions[index];
          const direction = card.isReversed ? '역방향' : '정방향';
          return `${position}: ${card.name} (${direction})`;
        })
        .join('\n');

      const prompt = `사용자 질문: ${question}, 사용자가 뽑은 세 장의 카드: ${cardDescriptions}`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `당신은 경험 많은 타로카드 해석가입니다. 사용자들에게 친절하고 통찰력 있는 타로 리딩을 한국어로 마크다운 형식으로 제공합니다. 다음 지침을 따라주세요:
                사용자가 뽑은 세 장의 카드의 이름과 기본적인 의미를 알려주고, 카드의 의미를 사용자 질문과 연관지어서 해석해주세요. 긍정적이고 건설적인 조언을 제공하되, 과도하게 구체적인 예측은 피하세요.
                윤리적이고 책임감 있는 조언을 제공하세요. 불법적이거나 해로운 행동을 조장히지 마세요.
              ### 예시 ###
              __과거: The Hermit (정방향)__
              과거에 당신이 따뜻한 ... 
              
              __현재: The High Priestess (역방향)__
              현재 당신은 새로운 시작의 ...
              
              __미래: The Devil (정방향)__
              가까운 미래에는 물질적 안정이나 ...
              
              __조언__
              과거의 따뜻한 기억과 ...`,
            },
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SAJU_API_KEY}`,
          },
        }
      );

      const assistantMessage = response.data.choices[0].message.content;
      setInterpretation(assistantMessage);
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '해석을 가져오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const drawCards = async () => {
    // 카드 뽑기 로직
    let availableCards = [...cards];
    let drawnCards = [];

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const randomCard = availableCards[randomIndex];
      const reversed = Math.random() < 0.5;

      drawnCards.push({ ...randomCard, isReversed: reversed });
      availableCards.splice(randomIndex, 1);
    }

    setSelectedCards(drawnCards);

    // 애니메이션 값 초기화
    fadeAnim1.setValue(0);
    fadeAnim2.setValue(0);
    fadeAnim3.setValue(0);

    // 애니메이션 시작
    animateCards();

    // 해석 상태 초기화
    setInterpretation('');

    // 해석 요청
    await getInterpretation(drawnCards);
  };

  const resetCards = () => {
    setSelectedCards([]);
    fadeAnim1.setValue(0);
    fadeAnim2.setValue(0);
    fadeAnim3.setValue(0);
    setInterpretation('');
  };

  return (
    <View style={styles.container}>
      {selectedCards.length === 3 ? (
        <View style={{ width: '100%' }}>
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {selectedCards.map((card, index) => {
              const fadeAnim =
                index === 0 ? fadeAnim1 : index === 1 ? fadeAnim2 : fadeAnim3;
              return (
                <Animated.View key={index} style={{ opacity: fadeAnim }}>
                  <View style={styles.cardWrapper}>
                    <Text style={styles.positionLabel}>
                      {index === 0 ? '과거' : index === 1 ? '현재' : '미래'}
                    </Text>
                    <Image
                      source={card.image}
                      style={[
                        styles.cardImage,
                        card.isReversed && styles.reversedImage,
                      ]}
                    />
                    <Text style={styles.cardName}>
                      {card.name} {card.isReversed ? '(역방향)' : ''}
                    </Text>
                    <Text style={styles.cardDescription}>
                      {card.isReversed
                        ? card.reversedDescription
                        : card.description}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
            {loading ? (
              <View></View>
            ) : (
              <View style={styles.interpretationContainer}>
                <Text style={styles.interpretationTitle}>종합 해석</Text>
                <Markdown
                  style={{
                    body: {
                      fontSize: 16,
                      lineHeight: 24,
                    },
                  }}
                >
                  {interpretation}
                </Markdown>
              </View>
            )}
            <View style={{ width: '100%', paddingHorizontal: 20 }}>
              <Button
                title="다시 뽑기"
                onPress={resetCards}
                disabled={loading}
                isLoading={loading}
                styles={{ container: { marginTop: 20 } }}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.drawContainer}>
          <Text style={styles.title}>타로카드 세 장 뽑기</Text>
          <Image
            style={styles.cardImage}
            source={require('../../assets/cards/back.jpg')}
          />
          <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 20 }}>
            <TextInput
              style={styles.input}
              placeholder="질문 입력 (예: 새로운 만남)"
              value={question}
              onChangeText={setQuestion}
            />
          </View>
          <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
            <Button
              title="카드 뽑기"
              onPress={drawCards}
              disabled={loading}
              isLoading={loading}
              styles={{ container: { marginTop: 20 } }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  drawContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  positionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardImage: {
    width: 150,
    height: 250,
    resizeMode: 'contain',
  },
  reversedImage: {
    transform: [{ rotate: '180deg' }],
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  cardDescription: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  interpretationContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  interpretationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default TarotCardScreen;
