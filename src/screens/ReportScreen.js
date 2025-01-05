import { StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import Button from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeInputView from '../components/SafeInputView';
import { GRAY } from '../colors';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useUserState } from '../contexts/UserContext';
import { saveReport } from '../api/report';

const ReportScreen = (props) => {
  const navigationto = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const [user] = useUserState();
  const [content, setContent] = useState('');

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props) {
      const currentMsg = props.route.params.currentMessage;
      if (currentMsg) {
        setContent(currentMsg);
      }
    }
  }, [props]);

  useLayoutEffect(() => {
    navigationto.setOptions({ headerTitle: '신고하기' });
  }, []);

  useEffect(() => {
    setDisabled(!content);
  }, [content]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const id = await saveReport({
        uid: user.uid,
        content: content,
      });
      Alert.alert('신고가 등록되었습니다.');
      navigationto.goBack();
    } catch (e) {
      Alert.alert('Creation Error', e.message);
      setIsLoading(false);
    }
  };

  return (
    <SafeInputView>
      <View
        style={[
          styles.container,
          { paddingTop: top, paddingBottom: bottom ? bottom + 10 : 40 },
        ]}
      >
        <Text>* AI가 생성한 콘텐츠에 문제가 있다면 신고해주세요.</Text>
        <TextInput
          value={content}
          placeholder="신고 내용을 입력해주세요."
          style={styles.input}
          multiline={true}
          onChangeText={(content) => setContent(content)}
        />
        <Button
          title="신고하기"
          onPress={onSubmit}
          disabled={disabled}
          isLoading={isLoading}
          styles={{ container: { marginTop: 20 } }}
        />
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: GRAY.DEFAULT,
    borderRadius: 5,
    height: '70%',
    width: '100%',
    padding: 20,
    marginTop: 20,
    textAlignVertical: 'top',
  },
});

export default ReportScreen;
