import { useNavigation } from '@react-navigation/native';
import { AuthRoutes } from '../navigations/routes';
import { View, Text, StyleSheet } from 'react-native';
import { PRIMARY, GRAY } from '../colors';
import Button from '../components/Button';

const TestStartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>나의 성향은 어떨까요?</Text>
      <Text style={styles.subtitle}>나에게는 어떤 상대가 어울릴까요?</Text>
      <Text style={styles.content}>비슷한 경험과 가치관을 공유하는</Text>
      <Text style={styles.content}>새로운 사람을 만나는 것을</Text>
      <Text style={styles.content}>안전하고 편안하게 소통하기 위해</Text>
      <Text style={styles.content}>먼저 나부터 알아보는 것은 중요하죠</Text>
      <Text style={styles.content}>나의 성향 진단 검사는</Text>
      <Text style={styles.impotent}>개인의 성향, 가치 목표, 역량</Text>
      <Text style={styles.content}>에 기반하여 구조화되어 있습니다.</Text>

      <Button
        title="시작하기"
        onPress={() => navigation.navigate(AuthRoutes.TEST)}
        disabled={false}
        isLoading={false}
        styles={{ container: { marginTop: 20 } }}
      />
      <Text style={styles.graycontent}>
        * 총 10개 문항으로 구성되어 있으며, 약 1분 가량 소요됩니다.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: PRIMARY.DEFAULT,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
  },
  subtitle: {
    color: PRIMARY.DEFAULT,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  content: {
    color: GRAY.DARK,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  impotent: {
    color: PRIMARY.DEFAULT,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  graycontent: {
    color: GRAY.DARK,
    fontSize: 13,
    fontWeight: '300',
    marginTop: 5,
  },
});

export default TestStartScreen;
