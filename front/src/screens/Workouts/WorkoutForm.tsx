import React, { useCallback, useEffect, useState } from "react";
import { AppError } from "@utils/AppError";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  VStack,
  View,
  useToast,
  Text,
  Spinner,
  Pressable,
  FlatList,
} from "native-base";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useForm, Controller } from "react-hook-form";
import {
  addWorkout,
  getWorkoutById,
  updatedWorkout,
} from "src/api/workout.service";
import { ScreenHeader } from "@components/ScreenHeader";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { getExerciseByGroup } from "src/api/exercise.service";
import { getGroups } from "src/api/group.service";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { Group } from "@components/Group";

type Exercise = {
  id: string;
  name: string;
};

type WorkoutDataProps = {
  description: string;
  average_execution_time: string;
  exercises: Exercise[];
};

const workoutSchema = yup.object().shape({
  description: yup.string().required("Descrição é obrigatória."),
  average_execution_time: yup.string().required("Tempo médio é obrigatório."),
  exercises: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required("ID do exercício é obrigatório."),
        name: yup.string().required("Nome do exercício é obrigatório."),
      })
    )
    .min(1, "Informe pelo menos um exercício."),
});

export function WorkoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("antebraço");
  const [exercisesLoaded, setExercisesLoaded] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const navigation = useNavigation<AppNavigatorRouteProps>();
  const route = useRoute();
  const toast = useToast();

  useEffect(() => {
    const { workoutId: routeWorkoutId } = route.params as { workoutId: string };
    if (routeWorkoutId) {
      reset();

      setWorkoutId(routeWorkoutId);
      fetchWorkoutDetails(routeWorkoutId);
    } else {
      reset();

      setWorkoutId(null);
    }
  }, [route.params]);

  async function fetchGroups() {
    try {
      const response = await getGroups();
      setGroups(response);
    } catch (error) {
      handleApiError(
        error,
        "Não foi possível carregar os grupos de exercícios."
      );
    }
  }

  async function fetchExerciseByGroup() {
    try {
      setLoadingExercises(true);
      const response = await getExerciseByGroup(selectedGroup);
      setExercises(response);
      setExercisesLoaded(true);
    } catch (error) {
      handleApiError(error, "Não foi possível carregar os exercícios.");
    } finally {
      setLoadingExercises(false);
    }
  }

  async function fetchWorkoutDetails(workoutId: string) {
    try {
      setLoadingExercises(true);
      const response = await getWorkoutById(workoutId);
      setSelectedGroup(response.group);
      setExercises(response.exercises);
      setExercisesLoaded(true);
      setValue("description", response.description);
      setValue(
        "average_execution_time",
        String(response.average_execution_time)
      );
      setSelectedExercises(response.exercises);
    } catch (error) {
      handleApiError(error, "Não foi possível carregar os detalhes do treino.");
    } finally {
      setLoadingExercises(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExerciseByGroup();
    }, [selectedGroup])
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<WorkoutDataProps>({
    resolver: yupResolver(workoutSchema) as any,
  });

  async function handleCreateOrUpdateWorkout(data: WorkoutDataProps) {
    try {
      setIsLoading(true);
      const workoutData = {
        description: data.description,
        exercises: selectedExercises,
        average_execution_time: Number(data.average_execution_time),
      };
      if (workoutId) {
        await updatedWorkout(workoutId, workoutData);
      } else {
        await addWorkout(workoutData);
      }
      setSelectedExercises([]);
      reset();
      setIsLoading(false);
      const successMessage = workoutId
        ? "Treino atualizado com sucesso!"
        : "Treino criado com sucesso!";
      toast.show({
        title: successMessage,
        placement: "top",
        bgColor: "green.400",
      });
      navigation.navigate("workoutsList");
    } catch (error) {
      handleApiError(error, "Não foi possível criar ou atualizar o treino.");
    } finally {
      setIsLoading(false);
    }
  }

  const renderExerciseItem = (item: ExerciseDTO) => {
    const isSelected = selectedExercises.some((ex) => ex.id === item.id);
    const handlePress = () => {
      const updatedExercises = isSelected
        ? selectedExercises.filter((ex) => ex.id !== item.id)
        : [...selectedExercises, item];
      setSelectedExercises(updatedExercises);
    };
    return (
      <Pressable
        key={item.id}
        onPress={handlePress}
        style={{
          backgroundColor: isSelected ? "#00B37E" : "#333333",
          padding: 10,
          marginVertical: 5,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>{item.name}</Text>
      </Pressable>
    );
  };

  const handleApiError = (error: any, defaultMessage: string) => {
    const isAppError = error instanceof AppError;
    const title = isAppError ? error.message : defaultMessage;
    toast.show({
      title,
      placement: "top",
      bgColor: "red.400",
    });
  };

  return (
    <VStack flex={1}>
      <ScreenHeader title={workoutId ? "Editar treino" : "Cadastrar treino"} />
      <VStack flex={1} px={4} py={4}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Descrição"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description?.message}
              />
            )}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Controller
            control={control}
            name="average_execution_time"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Tempo médio do treino (min)"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.average_execution_time?.message}
                keyboardType="number-pad"
              />
            )}
          />
        </View>
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Group
              onPress={() => setSelectedGroup(item)}
              name={item}
              isActive={
                String(selectedGroup).toUpperCase() ===
                String(item).toUpperCase()
              }
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ px: 8 }}
          my={4}
          maxH={10}
          minH={10}
        />
        <VStack space={2}>
          {exercises.length > 0 ? (
            exercises.map((item) => renderExerciseItem(item))
          ) : loadingExercises ? (
            <Spinner color="blue.500" size="lg" style={{ marginBottom: 12 }} />
          ) : (
            <Text>Nenhum exercício disponível.</Text>
          )}
        </VStack>
        <Button
          title={workoutId ? "Atualizar treino" : "Criar treino"}
          onPress={handleSubmit(handleCreateOrUpdateWorkout)}
          isLoading={isLoading}
          marginTop={4}
        />
      </VStack>
    </VStack>
  );
}
