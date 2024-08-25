import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../colors';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import IntroScreen from '../screens/IntroScreen';
import TestStartScreen from '../screens/TestStartScreen';
import TestScreen from '../screens/TestScreen';
import { AuthRoutes } from './routes';
import HeaderLeft from '../components/HeaderLeft';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: WHITE },
        title: '',
        headerLeft: HeaderLeft,
      }}
    >
      <Stack.Screen
        name={AuthRoutes.INTRO}
        component={IntroScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={AuthRoutes.START} component={TestStartScreen} />
      <Stack.Screen name={AuthRoutes.TEST} component={TestScreen} />
      <Stack.Screen
        name={AuthRoutes.SIGN_IN}
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AuthRoutes.SIGN_UP}
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
