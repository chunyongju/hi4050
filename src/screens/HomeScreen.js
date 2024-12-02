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
import { ContentRoutes } from '../navigations/routes';
import { MainRoutes } from '../navigations/routes';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const height = useWindowDimensions().height / 8;

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.topContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.icon} />
        <Text style={styles.title}>HeeVa</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigation.navigate(ContentRoutes.CHAT)}>
          <Image
            source={require('../../assets/home-chat.png')}
            style={[styles.image, { height }]}
          />
          <Text style={styles.buttonTitle}>대화</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigation.navigate(ContentRoutes.LIST)}>
          <Image
            source={require('../../assets/home-camera.png')}
            style={[styles.image, { height }]}
          />
          <Text style={styles.buttonTitle}>여행사진 공유</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => navigation.navigate(MainRoutes.COUNSEL_CRATE)}
        >
          <Image
            source={require('../../assets/home-clock.png')}
            style={[styles.image, { height }]}
          />
          <Text style={styles.buttonTitle}>AI 심리 상담</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigation.navigate(MainRoutes.MAP_GPS)}>
          <Image
            source={require('../../assets/home-map.png')}
            style={[styles.image, { height }]}
          />
          <Text style={styles.buttonTitle}>나의 근처 친구</Text>
        </Pressable>
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
    fontSize: 30,
    fontWeight: '700',
    bottom: 30,
    left: 30,
  },
});

export default HomeScreen;
