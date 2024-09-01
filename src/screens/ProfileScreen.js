import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import FastImage from '../components/FastImage';
import { useUserState } from '../contexts/UserContext';
import { logout } from '../api/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, WHITE, PRIMARY } from '../colors';
import DangerAlert, { AlertTypes } from '../components/DangerAlert';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';
import PostList from '../components/PostList';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useUserState();
  const { top } = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);
  const [stests, setStests] = useState(true);

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

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <DangerAlert
        visible={visible}
        onClose={() => setVisible(false)}
        alertType={AlertTypes.LOGOUT}
        onConfirm={async () => {
          await logout();
          setUser({});
        }}
      />
      <View style={styles.settingButton}>
        <Pressable onPress={() => setVisible(true)} hitSlop={10}>
          <MaterialCommunityIcons name="logout" size={24} color={GRAY.DARK} />
        </Pressable>
      </View>

      <View style={styles.profile}>
        <View
          style={[
            styles.photo,
            user.photoURL || { backgroundColor: GRAY.DEFAULT },
          ]}
        >
          <FastImage source={{ uri: user.photoURL }} style={styles.photo} />
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate(MainRoutes.UPDATE_PROFILE)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={WHITE} />
          </Pressable>
        </View>

        <Text style={styles.nickname}>{user.displayName || 'nickname'}</Text>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.tableHeader}>
          <Pressable
            onPress={() => setStests(true)}
            style={stests ? styles.headerTabTrue : styles.headerTabFalse}
          >
            <Text style={styles.headerText}>진단결과</Text>
          </Pressable>
          <Pressable
            onPress={() => setStests(false)}
            style={stests ? styles.headerTabFalse : styles.headerTabTrue}
          >
            <Text style={styles.headerText}>내 사진</Text>
          </Pressable>
        </View>
        {stests ? (
          <ScrollView style={styles.container}>
            {Object.entries(tests).map(([id, data]) => (
              <View key={id} style={styles.tableRow}>
                <Text style={styles.rowText}>
                  문항: {id} = 답변: {data.index}. {data.value}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <PostList isMyPost={true} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  settingButton: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    paddingTop: 15,
    paddingBottom: 15,
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: GRAY.DEFAULT,
    paddingBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY.DARK,
  },
  nickname: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTabTrue: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTabFalse: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY.DARK,
  },
  rowText: {
    fontSize: 16,
    flex: 1,
    color: GRAY.DARK,
  },
});

export default ProfileScreen;
