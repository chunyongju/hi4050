import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../colors';
import { MainRoutes } from './routes';
import ContentTab from './ContentTab';
import SelectPhotosScreen from '../screens/SelectPhotosScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import HeaderLeft from '../components/HeaderLeft';
import ImagePickerScreen from '../screens/ImagePickerScreen';
import WriteTextScreen from '../screens/WriteTextScreen';
import MapScreen from '../screens/MapScreen';
import ChatCreateScreen from '../screens/ChatCreateScreen';
import ChatScreen from '../screens/ChatScreen';
import CounselCreateScreen from '../screens/CounselCreateScreen';
import CounselScreen from '../screens/counselScreen';
import ReportScreen from '../screens/ReportScreen';
import GpsScreen from '../screens/GpsScreen';
import SajuScreen from '../screens/SajuScreen';
import SajuLuckScreen from '../screens/SajuLuckScreen';
import TarotCardScreen from '../screens/TarotCardScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: WHITE },
        title: '',
        headerLeft: HeaderLeft,
      }}
    >
      <Stack.Screen
        name={MainRoutes.CONTENT_TAB}
        component={ContentTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={MainRoutes.SELECT_PHOTOS}
        component={SelectPhotosScreen}
      />
      <Stack.Screen
        name={MainRoutes.UPDATE_PROFILE}
        component={UpdateProfileScreen}
      />
      <Stack.Screen
        name={MainRoutes.IMAGE_PICKER}
        component={ImagePickerScreen}
      />
      <Stack.Screen name={MainRoutes.WRITE_TEXT} component={WriteTextScreen} />
      <Stack.Screen name={MainRoutes.MAP_VIEW} component={MapScreen} />

      <Stack.Screen name={MainRoutes.CHAT_CRATE} component={ChatCreateScreen} />
      <Stack.Screen name={MainRoutes.CHAT_ROOM} component={ChatScreen} />

      <Stack.Screen
        name={MainRoutes.COUNSEL_CRATE}
        component={CounselCreateScreen}
      />
      <Stack.Screen name={MainRoutes.COUNSEL_ROOM} component={CounselScreen} />
      <Stack.Screen name={MainRoutes.REPORT} component={ReportScreen} />

      <Stack.Screen name={MainRoutes.MAP_GPS} component={GpsScreen} />
      <Stack.Screen name={MainRoutes.SAJU} component={SajuScreen} />
      <Stack.Screen name={MainRoutes.SAJU_LUCK} component={SajuLuckScreen} />
      <Stack.Screen name={MainRoutes.TAROT_CARD} component={TarotCardScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
