import { HistoryCard } from "@components/History/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { WorkoutCard } from "@components/Workout/WorkoutCard";
import { WorkoutDTO } from "@dtos/WorkoutDTO";
import { useFocusEffect } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import { getWorkouts } from "src/api/workout.service";

export function WorkoutsList() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [workoutsList, setWorkoutsList] = useState<WorkoutDTO[]>([]);

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await getWorkouts();
      setWorkoutsList(response);
      console.log(response);
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

      {isLoading && workoutsList ? (
        <Loading />
      ) : (
        workoutsList.map((workout) => <WorkoutCard workout={workout} />)
      )}

      {workoutsList.length === 0 && (
        <Text color={"gray.100"} textAlign={"center"}>
          Não há treinos cadastrados ainda.
        </Text>
      )}
    </VStack>
  );
}
