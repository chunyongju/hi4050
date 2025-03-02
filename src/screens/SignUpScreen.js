import { useNavigation } from '@react-navigation/native';
import { AuthRoutes } from '../navigations/routes';
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import TextButton from '../components/TextButton';
import Input, { ReturnKeyTypes, InputTypes } from '../components/Input';
import { useReducer, useRef, useEffect, useState } from 'react';
import Button from '../components/Button';
import HR from '../components/HR';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeInputView from '../components/SafeInputView';
import { WHITE } from '../colors';
import {
  authFormReducer,
  AuthFormTypes,
  initAuthForm,
} from '../reducers/authFormReducer';
import { getAuthErrorMessages, signUp } from '../api/auth';
import { saveTests } from '../api/stest';
import { useUserState } from '../contexts/UserContext';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [form, dispatch] = useReducer(authFormReducer, initAuthForm);

  const [, setUser] = useUserState();
  const [tests, setTests] = useState([]);

  const { getItem, setItem } = useAsyncStorage('sTest');

  const load = async () => {
    try {
      const data = await getItem();
      const sTest = JSON.parse(data || '[]');
      //console.log(sTest);
      setTests(sTest);
    } catch (e) {
      Alert.alert('불러오기 실패', '데이터 불러오기에 실패했습니다.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    const disabled =
      !newForm.email ||
      !newForm.password ||
      newForm.password !== newForm.passwordConfirm;

    dispatch({
      type: AuthFormTypes.UPDATE_FORM,
      payload: { disabled, ...payload },
    });
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!form.disabled && !form.isLoading) {
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
      try {
        const user = await signUp(form);
        setUser(user);
        /**
        if (tests) {
          //  await saveTests(user.uid, tests);
          const sTestData = {
            userId: user.uid, // 사용자 식별자
            answers: tests,
          };
          saveTests(sTestData);
        }
           */
      } catch (e) {
        const message = getAuthErrorMessages(e.code);
        Alert.alert('회원가입 실패', message, [
          {
            text: '확인',
            onPress: () => dispatch({ type: AuthFormTypes.TOGGLE_LOADING }),
          },
        ]);
      }
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
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
            value={form.email}
            onChangeText={(text) => updateForm({ email: text.trim() })}
            inputType={InputTypes.EMAIL}
            returnKeyType={ReturnKeyTypes.NEXT}
            onSubmitEditing={() => passwordRef.current.focus()}
            styles={{ container: { marginBottom: 20 } }}
          />
          <Input
            ref={passwordRef}
            value={form.password}
            onChangeText={(text) => updateForm({ password: text.trim() })}
            inputType={InputTypes.PASSWORD}
            returnKeyType={ReturnKeyTypes.NEXT}
            onSubmitEditing={() => passwordConfirmRef.current.focus()}
            styles={{ container: { marginBottom: 20 } }}
          />
          <Input
            ref={passwordConfirmRef}
            value={form.passwordConfirm}
            onChangeText={(text) =>
              updateForm({ passwordConfirm: text.trim() })
            }
            inputType={InputTypes.PASSWORD_CONFIRM}
            returnKeyType={ReturnKeyTypes.DONE}
            onSubmitEditing={onSubmit}
            styles={{ container: { marginBottom: 20 } }}
          />

          <View style={{ flexDirection: 'row', paddingRight: 40 }}>
            <TextButton
              title={'개인정보처리방침'}
              onPress={() => navigation.navigate(AuthRoutes.PRIVACY)}
            />
            <View style={{ marginLeft: 20, marginRight: 40 }}>
              <Text>|</Text>
            </View>
            <TextButton
              title={'이용약관'}
              onPress={() => navigation.navigate(AuthRoutes.POLICY)}
            />
          </View>

          <Button
            title="회원가입"
            onPress={onSubmit}
            disabled={form.disabled}
            isLoading={form.isLoading}
            styles={{ container: { marginTop: 20 } }}
          />

          <HR text={'OR'} styles={{ container: { marginVertical: 30 } }} />

          <TextButton
            title={'로그인'}
            onPress={() => navigation.navigate(AuthRoutes.SIGN_IN)}
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

export default SignUpScreen;
