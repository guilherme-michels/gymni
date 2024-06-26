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
import { addWorkout } from "src/api/workout.service";
import { ScreenHeader } from "@components/ScreenHeader";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { getExerciseByGroup } from "src/api/exercise.service";
import { getGroups } from "src/api/group.service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { Group } from "@components/Group";

type Exercise = {
  id: string;
  name: string;
};

type WorkoutDataProps = {
  description: string;
  exercises: Exercise[];
};

const workoutSchema = yup.object().shape({
  description: yup.string().required("Descrição é obrigatória."),
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
  const navigation = useNavigation<AppNavigatorRouteProps>();

  const toast = useToast();

  async function fetchGroups() {
    try {
      const response = await getGroups();
      setGroups(response);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os grupos de exercícios.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.400",
      });
    }
  }

  async function fetchExerciseByGroup() {
    try {
      setLoadingExercises(true);

      const response = await getExerciseByGroup(selectedGroup);
      setExercises(response);
      setExercisesLoaded(true);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os exercícios.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.400",
      });
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
  } = useForm<WorkoutDataProps>({
    resolver: yupResolver(workoutSchema) as any,
  });

  async function handleCreateWorkout(data: WorkoutDataProps) {
    try {
      setIsLoading(true);

      await addWorkout({
        description: data.description,
        exercises: selectedExercises,
      });

      setSelectedExercises([]);

      reset();
      navigation.navigate("workoutsList");
      setIsLoading(false);

      toast.show({
        title: "Treino criado com sucesso!",
        placement: "top",
        bgColor: "green.400",
      });
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar o treino.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.400",
      });
    }
  }

  const renderExerciseItem = (item: ExerciseDTO) => {
    const isSelected = selectedExercises.some((ex) => ex.id === item.id);

    const handlePress = () => {
      const index = selectedExercises.findIndex((ex) => ex.id === item.id);
      if (index === -1) {
        setSelectedExercises([...selectedExercises, item]);
      } else {
        const updatedExercises = [...selectedExercises];
        updatedExercises.splice(index, 1);
        setSelectedExercises(updatedExercises);
      }
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

  return (
    <VStack flex={1}>
      <ScreenHeader title="Cadastrar treino" />

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
          title="Criar treino"
          onPress={handleSubmit(handleCreateWorkout)}
          isLoading={isLoading}
          marginTop={4}
        />
      </VStack>
    </VStack>
  );
}
