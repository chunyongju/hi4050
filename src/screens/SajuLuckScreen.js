import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { SAJU_API_KEY } from '../../env';
import Button from '../components/Button';
import TextButton from '../components/TextButton';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';
import HR from '../components/HR';
import { Picker } from '@react-native-picker/picker';
import { GRAY } from '../colors';
import Markdown from 'react-native-markdown-display'; // 마크다운 컴포넌트 추가

const SajuLuckScreen = () => {
  const navigation = useNavigation();
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [fortuneType, setFortuneType] = useState('사업운'); // 기본 선택
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 사주풀이 요청 함수
  const handleSajuRequest = async () => {
    setLoading(true);
    setResult('');

    const today = new Date(); // 올해 연도 지정

    // 사용자 입력을 기반으로 요청 메시지 생성
    const userPrompt = `생년월일 ${year}년 ${month}월 ${day}일 ${hour}시에 태어난 사람의 ${fortuneType}에 대한 운세풀이를 해주세요. 평생 운세와 ${today.getFullYear()}년의 운세를 구분하여 설명해 주세요.`;
    const heavenly =
      '"甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"';
    const earthly =
      '"子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"';

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `당신은 운세풀이 전문가 입니다. ${heavenly}와 ${earthly} 글자를 활용해서 표현해주세요. 마크다운형식으로 표시해주세요.`,
            },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 1200,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SAJU_API_KEY}`, // 발급받은 API 키를 여기에 입력
          },
        }
      );

      const sajuResult = response.data.choices[0].message.content.trim();
      setResult(sajuResult);
    } catch (error) {
      console.error('Error fetching Saju explanation:', error);
      setResult('운세풀이에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>운세</Text>
      <TextInput
        style={styles.input}
        placeholder="출생 연도 (예: 1980)"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        style={styles.input}
        placeholder="출생 월 (예: 5)"
        keyboardType="numeric"
        value={month}
        onChangeText={setMonth}
      />
      <TextInput
        style={styles.input}
        placeholder="출생 일 (예: 15)"
        keyboardType="numeric"
        value={day}
        onChangeText={setDay}
      />
      <TextInput
        style={styles.input}
        placeholder="출생 시간 (예: 14)"
        keyboardType="numeric"
        value={hour}
        onChangeText={setHour}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>운세 선택:</Text>
        <Picker
          selectedValue={fortuneType}
          style={styles.picker}
          onValueChange={(itemValue) => setFortuneType(itemValue)}
        >
          <Picker.Item label="사업운" value="사업운" />
          <Picker.Item label="재물운" value="재물운" />
          <Picker.Item label="연애운" value="연애운" />
        </Picker>
      </View>
      <Button
        title="운세 요청"
        onPress={handleSajuRequest}
        disabled={loading}
        isLoading={loading}
        styles={{ container: { marginVertical: 20 } }}
      />
      {loading ? (
        <View></View>
      ) : (
        <View style={styles.result}>
          <Markdown>{result}</Markdown>
        </View>
      )}

      <HR text={'OR'} styles={{ container: { marginVertical: 30 } }} />

      <TextButton
        title={'사주풀이'}
        onPress={() => navigation.navigate(MainRoutes.SAJU)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: GRAY.DARK,
  },
  picker: {
    height: 40,
    width: '100%',
    color: GRAY.DARK,
    backgroundColor: GRAY.LIGHT,
  },
  result: {
    width: '100%',
    marginTop: 20,
  },
});

export default SajuLuckScreen;
