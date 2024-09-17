import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Image, StyleSheet, View, ScrollView, Alert } from 'react-native';
import { WHITE } from '../colors';
import Input, { ReturnKeyTypes, InputTypes } from '../components/Input';
import Button from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SafeInputView from '../components/SafeInputView';
import { createChannel, updateChannel } from '../api/chat';

const ChatCreateScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  //console.log(params);
  const { top, bottom } = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonTitle, setButtonTitle] = useState('대화방 및 AI 생성');
  const descriptionRef = useRef();

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params) {
      setButtonTitle('AI 캐릭터 수정');
      setDescription(params.description);
      setTitle(params.title);
    }
  }, [params]);

  useEffect(() => {
    setDisabled(isLoading || !title || !description);
  }, [isLoading, title, description]);

  const onSubmit = async () => {
    setIsLoading(true);
    if (params) {
      const id = params.id;
      try {
        await updateChannel({ id, title, description });
        navigation.goBack();
      } catch (e) {
        Alert.alert('Update Error', e.message);
        setIsLoading(false);
      }
    } else {
      try {
        const id = await createChannel({ title, description });
        navigation.goBack();
      } catch (e) {
        Alert.alert('Creation Error', e.message);
        setIsLoading(false);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: 'AI 대화 설정' });
  }, []);

  return (
    <SafeInputView>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={require('../../assets/chatgpt.png')}
            style={{ width: '100%' }}
            resizeMode="cover"
          />
        </View>

        <ScrollView
          style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}
          contentContainerStyle={{ alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="always"
        >
          <Input
            value={title}
            onChangeText={(text) => setTitle(text)}
            inputType={InputTypes.TITLE}
            returnKeyType={ReturnKeyTypes.NEXT}
            onSubmitEditing={() => {
              setTitle(title.trim());
              descriptionRef.current.focus();
            }}
            styles={{ container: { marginBottom: 20 } }}
          />
          <Input
            ref={descriptionRef}
            value={description}
            onChangeText={(text) => setDescription(text)}
            inputType={InputTypes.DESCRIPTION}
            returnKeyType={ReturnKeyTypes.DONE}
            onSubmitEditing={onSubmit}
            styles={{
              container: { marginBottom: 20 },
              input: { height: 100, textAlignVertical: 'top' },
              icon: { justifyContent: 'top', marginTop: 10 },
            }}
            multiline={true}
          />

          <Button
            title={buttonTitle}
            onPress={onSubmit}
            disabled={disabled}
            isLoading={isLoading}
            styles={{ container: { marginTop: 20 } }}
          />
        </ScrollView>
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  form: {
    flexGrow: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default ChatCreateScreen;
