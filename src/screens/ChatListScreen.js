import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';
import { GRAY, WHITE, PRIMARY } from '../colors';
import { MainRoutes } from '../navigations/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import moment from 'moment';

const getDateOrTime = (ts) => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};

const ChatListScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const collectionQuery = query(
      collection(getFirestore(), 'channels'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setChannels(list);
    });
    return () => unsubscribe();
  }, []);

  const Item = React.memo(({ item: { id, title, description, createdAt } }) => {
    return (
      <Pressable
        style={styles.ItemContainer}
        onPress={() => navigation.navigate(MainRoutes.CHAT_ROOM, { id, title })}
      >
        <View style={styles.ItemTextContainer}>
          <Text style={styles.ItemTitle}>{title}</Text>
          <Text style={styles.ItemDescription}>{description}</Text>
        </View>
        <Text style={styles.ItemTime}>{getDateOrTime(createdAt)}</Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={GRAY.DARK}
        />
      </Pressable>
    );
  });

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.settingButton}>
        <Pressable
          onPress={() => navigation.navigate(MainRoutes.CHAT_CRATE)}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="chat-plus"
            size={24}
            color={PRIMARY.DEFAULT}
          />
        </Pressable>
      </View>

      <FlatList
        keyExtractor={(item) => item['id']}
        data={channels}
        renderItem={({ item }) => <Item item={item} />}
        windowSize={3}
      />
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
  ItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: GRAY.LIGHT,
    padding: 15,
  },
  ItemTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  ItemTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  ItemDescription: {
    fontSize: 16,
    marginTop: 5,
    color: GRAY.DEFAULT,
  },
  ItemTime: {
    fontSize: 12,
    color: GRAY.DEFAULT,
  },
});

export default ChatListScreen;
