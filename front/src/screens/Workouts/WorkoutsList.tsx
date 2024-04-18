import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { WorkoutCard } from "@components/Workout/WorkoutCard";
import { WorkoutDTO } from "@dtos/WorkoutDTO";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";
import { ScrollView, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import { getWorkouts } from "src/api/workout.service";

export function WorkoutsList() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [workoutsList, setWorkoutsList] = useState<WorkoutDTO[]>([]);

  const navigation = useNavigation<AppNavigatorRouteProps>();

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await getWorkouts();
      setWorkoutsList(response);
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
      <ScreenHeader title="Meus treinos" onClick={() => console.log("a")} />

      <ScrollView px={3}>
        {isLoading && workoutsList ? (
          <Loading />
        ) : (
          workoutsList.map((workout) => (
            <WorkoutCard
              workout={workout}
              key={workout.id}
              onPress={() =>
                navigation.navigate("workout", { workoutId: workout.id })
              }
            />
          ))
        )}

        {workoutsList.length === 0 && (
          <Text color={"gray.100"} textAlign={"center"}>
            Não há treinos cadastrados ainda.
          </Text>
        )}
      </ScrollView>
    </VStack>
  );
}
