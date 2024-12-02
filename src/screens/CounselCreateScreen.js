import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Image, StyleSheet, View, ScrollView, Alert, Text } from 'react-native';
import { WHITE } from '../colors';
import Button from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SafeInputView from '../components/SafeInputView';
import { createCounsel, updateCounsel } from '../api/counsel';
import { useUserState } from '../contexts/UserContext';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { MainRoutes } from '../navigations/routes';

const CounselCreateScreen = () => {
  const navigation = useNavigation();

  const { top, bottom } = useSafeAreaInsets();
  const [user] = useUserState();

  const [title, setTitle] = useState('AI 상담사');
  const [description, setDescription] = useState('심리 상담실');
  const [buttonTitle, setButtonTitle] = useState('심리 상담실 입장');

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [counsels, setCounsels] = useState([]);
  const [sid, setSid] = useState('');

  useEffect(() => {
    const collectionQuery = query(
      collection(getFirestore(), 'counsels'),
      where('id', '==', user.uid)
    );
    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setCounsels(list);
      if (counsels.length) {
        setSid(counsels[0].id);
      } else {
        setSid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async () => {
    if (counsels.length) {
      navigation.navigate(MainRoutes.COUNSEL_ROOM, {
        id: sid,
        title: title,
        description: description,
      });
    } else {
      try {
        setIsLoading(true);
        const id = await createCounsel({
          id: user.uid,
          title: title,
          description: description,
        });
        setIsLoading(false);
        navigation.navigate(MainRoutes.COUNSEL_ROOM, {
          id,
          title,
          description,
        });
      } catch (e) {
        Alert.alert('Creation Error', e.message);
        setIsLoading(false);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: 'AI 심리 상담사' });
  }, []);

  return (
    <SafeInputView>
      <StatusBar style="dark" />
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={styles.aimage}>
          <Image
            source={require('../../assets/counselor.png')}
            style={styles.photo}
          />
        </View>

        <ScrollView
          style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}
          contentContainerStyle={{ alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="always"
        >
          <Text style={styles.counselor}>
            AI 심리 상담사가 회원님의 다양한 고민들을 들어드립니다.
          </Text>

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
  aimage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  form: {
    flexGrow: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  counselor: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 80,
  },
});

export default CounselCreateScreen;
