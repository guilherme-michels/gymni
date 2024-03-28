import { HistoryCard } from "@components/History/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { useFocusEffect } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { Heading, SectionList, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import { getHistory } from "src/api/history.service";

export function History() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [historyExercises, setHistoryExercises] = useState<HistoryByDayDTO[]>(
    []
  );

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await getHistory();
      setHistoryExercises(response);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os dados.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.400",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de treinos" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={historyExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard history={item} />}
          px={8}
          renderSectionHeader={({ section }) => (
            <Heading color={"gray.100"} fontSize={"md"} mt={8} mb={2}>
              {section.title}
            </Heading>
          )}
          contentContainerStyle={
            historyExercises.length === 0 && {
              flex: 1,
              justifyContent: "center",
            }
          }
          ListEmptyComponent={() => (
            <Text color={"gray.100"} textAlign={"center"}>
              Não há exercícios registrados ainda.
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}
