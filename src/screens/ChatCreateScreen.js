import { useNavigation } from '@react-navigation/native';
import { useState, useRef, useEffect } from 'react';
import { Image, StyleSheet, View, ScrollView, Alert } from 'react-native';
import { WHITE } from '../colors';
import Input, { ReturnKeyTypes, InputTypes } from '../components/Input';
import Button from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SafeInputView from '../components/SafeInputView';
import { createChannel } from '../api/chat';

const ChatCreateScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const descriptionRef = useRef();

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDisabled(isLoading || !title);
  }, [isLoading, title]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const id = await createChannel({ title, description });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Creation Error', e.message);
      setIsLoading(false);
    }
  };

  return (
    <SafeInputView>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={require('../../assets/cover.png')}
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
            styles={{ container: { marginBottom: 20 } }}
          />

          <Button
            title="대화방 만들기"
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
