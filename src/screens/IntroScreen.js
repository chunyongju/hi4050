import { useNavigation } from '@react-navigation/native';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { WHITE } from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthRoutes } from '../navigations/routes';
import TextButton from '../components/TextButton';
import HR from '../components/HR';

const IntroScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const height = useWindowDimensions().height / 4;

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.topContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.icon} />
        <Text style={styles.title}>HeeVa</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigation.navigate(AuthRoutes.START)}>
          <Image
            source={require('../../assets/home-clock.png')}
            style={[styles.image, { height }]}
          />
          <Text style={styles.buttonTitle}>진단하기</Text>
        </Pressable>
      </View>

      <View style={{ alignItems: 'center' }}>
        <HR text={'OR'} styles={{ container: { marginVertical: 30 } }} />

        <TextButton
          title={'로그인'}
          onPress={() => navigation.navigate(AuthRoutes.SIGN_IN)}
        />

        <HR text={'OR'} styles={{ container: { marginVertical: 30 } }} />

        <TextButton
          title={'회원가입'}
          onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 20,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    fontSize: 30,
    color: '#3679fe',
    fontWeight: '700',
    marginLeft: 10,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  image: {
    borderRadius: 10,
    width: '100%',
  },
  buttonTitle: {
    position: 'absolute',
    color: WHITE,
    fontSize: 40,
    fontWeight: '700',
    bottom: 30,
    left: 30,
  },
});

export default IntroScreen;
