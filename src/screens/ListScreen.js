import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';
import PostList from '../components/PostList';
import { WHITE, PRIMARY, GRAY } from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ListScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.settingButton}>
        <Pressable
          onPress={() => navigation.navigate(MainRoutes.MAP_VIEW)}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="map"
            size={24}
            color={PRIMARY.DEFAULT}
          />
        </Pressable>
      </View>

      <PostList />
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
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: GRAY.LIGHT,
  },
});

export default ListScreen;
