import { useNavigation } from '@react-navigation/native';
import { Image, View, StyleSheet, ScrollView } from 'react-native';
import { AuthRoutes } from '../navigations/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeInputView from '../components/SafeInputView';
import { StatusBar } from 'expo-status-bar';
import { WHITE } from '../colors';
import Button from '../components/Button';

const IntroStartScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <SafeInputView>
      <StatusBar style="dark" />
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={require('../../assets/splash.png')}
            style={{ flex: 1, width: 'auto' }}
            resizeMode="cover"
          />
        </View>

        <ScrollView
          style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}
          contentContainerStyle={{ alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="always"
        >
          <Button
            title="히바 시작하기"
            onPress={() => navigation.navigate(AuthRoutes.INTRO)}
            disabled={false}
            isLoading={false}
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

export default IntroStartScreen;
