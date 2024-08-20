import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatListScreen from '../screens/ChatListScreen';
import { ContentRoutes } from './routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../colors';
import TabBarAddButton from '../components/TabBarAddButton';

const Tab = createBottomTabNavigator();

const getTabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const AddButtonScreen = () => null;

const ContentTab = () => {
  return (
    <Tab.Navigator
      initialRouteName={ContentRoutes.HOME}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY.DARK,
        tabBarInactiveTintColor: GRAY.DARK,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'home' }),
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name={ContentRoutes.LIST}
        component={ListScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'post' }),
        }}
      />
      <Tab.Screen
        name={'AddButton'}
        component={AddButtonScreen}
        options={{ tabBarButton: () => <TabBarAddButton /> }}
      />
      <Tab.Screen
        name={ContentRoutes.CHAT}
        component={ChatListScreen}
        options={{
          tabBarIcon: (props) =>
            getTabBarIcon({ ...props, name: 'chat-processing' }),
        }}
      />
      <Tab.Screen
        name={ContentRoutes.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'account' }),
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
