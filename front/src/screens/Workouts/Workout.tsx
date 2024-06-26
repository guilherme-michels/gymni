import React, { useEffect, useState } from "react";
import {
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
  Button as NativeBaseButton,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { WorkoutDTO } from "@dtos/WorkoutDTO";
import {
  addWorkoutRegister,
  getWorkoutById,
  deleteWorkout,
} from "src/api/workout.service";
import { ScreenHeader } from "@components/ScreenHeader";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "src/api";
import { TouchableOpacity } from "react-native";
import { Button } from "@components/Button";
import { AppNavigatorRouteProps } from "@routes/app.routes";

type WorkoutRouteParamsProps = {
  workoutId: string;
};

export function Workout() {
  const [workout, setWorkout] = useState<WorkoutDTO>({} as WorkoutDTO);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingRegister, setIsSendingRegister] = useState(false);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(
    []
  );
  const route = useRoute();
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRouteProps>();

  const { workoutId } = route.params as WorkoutRouteParamsProps;

  async function fetchWorkoutDetails() {
    try {
      setIsLoading(true);
      const response = await getWorkoutById(workoutId);
      setWorkout(response);
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

  async function handleWorkoutHistoryRegister() {
    try {
      setIsSendingRegister(true);
      await addWorkoutRegister(workoutId);
      setCompletedExerciseIds([]);
      toast.show({
        title: "Treino concluído, parabéns!",
        placement: "top",
        bgColor: "green.400",
      });
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
      setIsSendingRegister(false);
    }
  }

  async function handleDeleteWorkout() {
    try {
      await deleteWorkout(workoutId);
      toast.show({
        title: "Treino excluído com sucesso!",
        placement: "top",
        bgColor: "green.400",
      });
      navigation.navigate("workoutsList");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível excluir o treino.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.400",
      });
    }
  }

  function handleExerciseClick(exerciseId: string) {
    const isAlreadyCompleted = completedExerciseIds.includes(exerciseId);
    if (isAlreadyCompleted) {
      setCompletedExerciseIds(
        completedExerciseIds.filter((id) => id !== exerciseId)
      );
    } else {
      setCompletedExerciseIds([...completedExerciseIds, exerciseId]);
    }
  }

  useEffect(() => {
    fetchWorkoutDetails();
  }, [workoutId]);

  const allExercisesCompleted =
    workout.exercises &&
    completedExerciseIds.length === workout.exercises.length;

  function chunkArray(arr: any[], size: number) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title={workout.description} />

      <ScrollView px={2}>
        <VStack mt={4} p={4} alignItems="stretch">
          {workout.exercises &&
            chunkArray(workout.exercises, 2).map(
              (rowExercises: ExerciseDTO[], rowIndex: number) => (
                <HStack key={rowIndex} mb={4}>
                  {rowExercises.map((exercise: ExerciseDTO) => (
                    <HStack
                      key={exercise.id}
                      flex={1}
                      mr={rowExercises.indexOf(exercise) === 0 ? 2 : 0}
                    >
                      <TouchableOpacity
                        onPress={() => handleExerciseClick(exercise.id)}
                        style={{
                          flex: 1,
                          borderColor: completedExerciseIds.includes(
                            exercise.id
                          )
                            ? "green"
                            : "transparent",
                          borderWidth: 2,
                          borderRadius: 8,
                        }}
                      >
                        <VStack
                          bg={"gray.600"}
                          p={4}
                          rounded={"lg"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          flex={1}
                        >
                          <Text color={"gray.100"} ml={1} fontSize={14} mb={2}>
                            {exercise.name}
                          </Text>
                          <Image
                            h={20}
                            w={20}
                            source={{
                              uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`,
                            }}
                            alt="exercise image"
                            mb={3}
                            rounded={"lg"}
                          />

                          <HStack
                            rounded={"md"}
                            alignItems={"center"}
                            justifyContent={"space-around"}
                          >
                            <HStack>
                              <Text color={"gray.100"} ml={1} fontSize={12}>
                                {exercise.series} Séries
                              </Text>
                            </HStack>

                            <HStack>
                              <Text color={"gray.100"} ml={1} fontSize={12}>
                                {exercise.repetitions} Repetições
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </TouchableOpacity>
                    </HStack>
                  ))}
                </HStack>
              )
            )}
        </VStack>

        <VStack flex={1} px={4} mt={4}>
          <Button
            title="Marcar como concluído"
            isLoading={sendingRegister}
            opacity={!allExercisesCompleted ? "20" : "100"}
            onPress={handleWorkoutHistoryRegister}
          />

          <NativeBaseButton
            mt={4}
            onPress={handleDeleteWorkout}
            colorScheme="red"
            variant="solid"
          >
            Excluir treino
          </NativeBaseButton>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
