import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { PRIMARY, WHITE } from "../colors";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { AuthRoutes } from "../navigations/routes";

const questions = [
  {
    question: "나는 새로운 일에 도전하는 걸 즐기고 지적 호기심이 많다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 1,
  },
  {
    question:
      "나는 사람들이 생각하지 못한 새로운 아이디어를 만들고 성장의 기회로 삼는다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 2,
  },
  {
    question: "나는 상상력이 풍부하며 관심 분야가 다양한 편이다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 3,
  },
  {
    question:
      "나는 구체적인 방향이 정해지면 목표가 달성될 때까지 진로에서 벗어나지 않고 주력한다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 4,
  },
  {
    question: "나는 주어진 일을 성실히 수행하고 자기절제가 강하고 근면하다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 5,
  },
  {
    question: "나는 혼자 일하는 것보다 여러 사람과 함께 일하는 것을 즐긴다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 6,
  },
  {
    question: "나는 다른 사람을 설득하고 영향력 주는 활동을 좋아한다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 7,
  },
  {
    question: "나는 새로운 환경에 빠르게 적응하고 생산적이다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 8,
  },
  {
    question:
      "나는 타인의 처지나 상황에 이입하여 그들의 감정을 잘 느낄 수 있다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 9,
  },
  {
    question: "나는 공감하고 협력적인 경향이 강하다.",
    options: [
      "대체로 그런 편이다",
      "대체로 그렇지 않은 편이다",
      "상황을 우선 고려한다",
    ],
    id: 10,
  },
  {
    question: "완료되었습니다. 회원가입 후 결과를 확인하실 수 있습니다.",
    options: [],
    id: 11,
  },
];

const PaginationBar = ({ currentPage, totalPages }) => {
  const progress = (currentPage / totalPages) * 100;

  return (
    <View style={styles.paginationContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Text
        style={styles.paginationText}
      >{`${currentPage}/${totalPages}`}</Text>
    </View>
  );
};

const TestScreen = () => {
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentIndex, setCurrentIndex] = useState(1);
  //console.log(selectedOptions);
  const swiperRef = useRef(null);

  const handleSelectOption = (questionId, option, index) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: { value: option, index: index + 1 },
    }));
  };

  const handleNext = () => {
    if (
      selectedOptions.hasOwnProperty(
        questions[swiperRef.current.state.index].id
      )
    ) {
      swiperRef.current.scrollBy(1);
    }
  };

  const handlePrev = () => {
    swiperRef.current.scrollBy(-1);
  };

  const { getItem, setItem } = useAsyncStorage("sTest");

  const save = async (data) => {
    try {
      await setItem(JSON.stringify(data));
    } catch (e) {
      Alert.alert("저장하기 실패", "데이터 저장에 실패했습니다.");
    }
  };

  const sendSignUp = () => {
    save(selectedOptions);
    navigation.navigate(AuthRoutes.SIGN_UP);
  };

  return (
    <View style={{ flex: 1 }}>
      {currentIndex !== questions.length && (
        <PaginationBar
          currentPage={currentIndex}
          totalPages={questions.length - 1}
        />
      )}
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        showsButtons={true}
        showsPagination={false}
        scrollEnabled={false}
        loop={false}
        onIndexChanged={(index) => setCurrentIndex(index + 1)}
        buttonWrapperStyle={styles.buttonWrapper}
        nextButton={
          <TouchableOpacity
            style={
              selectedOptions.hasOwnProperty(
                questions[swiperRef.current?.state.index]?.id
              )
                ? styles.abledButton
                : styles.disabledButton
            }
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        }
        prevButton={
          <TouchableOpacity style={styles.abledButton} onPress={handlePrev}>
            <Text style={styles.buttonText}>이전</Text>
          </TouchableOpacity>
        }
      >
        {questions.map((question) => (
          <View key={question.id} style={styles.slide}>
            <Text style={styles.text}>{question.question}</Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    selectedOptions[question.id]?.value === option
                      ? styles.selectedOption
                      : styles.unselectedOption,
                  ]}
                  onPress={() => handleSelectOption(question.id, option, index)}
                >
                  <Text
                    style={[
                      selectedOptions[question.id]?.value === option
                        ? styles.selectedOptionText
                        : styles.unselectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </Swiper>
      {currentIndex === questions.length && (
        <TouchableOpacity style={styles.signUpbutton} onPress={sendSignUp}>
          <Text style={styles.signUpbuttonText}>회원가입</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: WHITE,
    padding: 30,
  },
  text: {
    color: "#000",
    fontSize: 25,
    marginBottom: 50,
  },
  optionsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  optionButton: {
    padding: 20,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: PRIMARY.DEFAULT,
    borderColor: PRIMARY.DEFAULT,
  },
  unselectedOption: {
    backgroundColor: WHITE,
    borderColor: PRIMARY.DEFAULT,
  },
  selectedOptionText: {
    color: WHITE,
    fontSize: 18,
  },
  unselectedOptionText: {
    color: "#000",
    fontSize: 18,
  },
  buttonWrapper: {
    backgroundColor: "transparent",
    flexDirection: "row",
    position: "absolute",
    top: "auto",
    bottom: 30,
    width: "100%",
    height: 100,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
  },
  abledButton: {
    width: 110,
    height: 60,
    margin: 15,
    borderRadius: 20,
    backgroundColor: PRIMARY.DARK,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    width: 110,
    height: 60,
    margin: 15,
    borderRadius: 20,
    backgroundColor: PRIMARY.LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  progressBarBackground: {
    height: 10,
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginRight: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: PRIMARY.DARK,
    borderRadius: 5,
  },
  paginationText: {
    fontSize: 16,
    color: "#333",
  },
  signUpbutton: {
    position: "absolute",
    top: "auto",
    bottom: 50,
    right: 20,
    width: 110,
    height: 60,
    borderRadius: 20,
    backgroundColor: PRIMARY.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpbuttonText: {
    color: WHITE,
    fontSize: 18,
  },
});

export default TestScreen;
