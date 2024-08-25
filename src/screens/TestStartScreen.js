import { useNavigation } from '@react-navigation/native';
import { AuthRoutes } from '../navigations/routes';
import { View, Text, StyleSheet } from 'react-native';
import { PRIMARY, GRAY } from '../colors';
import Button from '../components/Button';

const TestStartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>퇴직하고 뭐하세요?</Text>
      <Text style={styles.subtitle}>
        나에게는 어떤 뉴업 New-UP(業)이 어울릴까요?
      </Text>
      <Text style={styles.content}>직장인으로 살아 온 우리 모두,</Text>
      <Text style={styles.content}>언젠가 한번은 퇴직을 맞이 합니다</Text>
      <Text style={styles.content}>이미 퇴직을 했든,</Text>
      <Text style={styles.content}>아직 현직에서 활약하든,</Text>
      <Text style={styles.content}>퇴직 이후의 여정은 정말 중요하죠</Text>
      <Text style={styles.content}>NPT(New-UP Planning Tool)은</Text>
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
        총 10개 문항으로 구성되어 있으며, 약 1분 가량 소요됩니다.
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
