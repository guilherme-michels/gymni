import { useCallback, useEffect, useState } from "react";
import { FlatList, HStack, Heading, Text, VStack, useToast } from "native-base";

import { ExerciseCard } from "@components/Exercise/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/Home/HomeHeader";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";
import { getGroups } from "src/api/group.service";
import { getExerciseByGroup } from "src/api/exercise.service";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

export function Home() {
  const navigation = useNavigation<AppNavigatorRouteProps>();
  const toast = useToast();

  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("antebraço");
  const [isLoading, setIsLoading] = useState(true);

  async function fetchGroups() {
    try {
      const response = await getGroups();
      setGroups(response);
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
    }
  }

  async function fetchExerciseByGroup() {
    try {
      setIsLoading(true);

      const response = await getExerciseByGroup(selectedGroup);
      setExercises(response);
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

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExerciseByGroup();
    }, [selectedGroup])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            onPress={() => setSelectedGroup(item)}
            name={item}
            isActive={
              String(selectedGroup).toUpperCase() === String(item).toUpperCase()
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

      <VStack flex={1} px={8}>
        <HStack justifyContent={"space-between"} mb={5} mt={2}>
          <Heading color={"gray.200"} fontSize={"md"}>
            Exercícios
          </Heading>

          <Text color={"gray.200"} fontSize={"sm"}>
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard
              onPress={() =>
                navigation.navigate("exercise", { exerciseId: item.id })
              }
              exercise={item}
              isLoading={!isLoading}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}
