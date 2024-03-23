import { useState } from "react";
import { FlatList, HStack, Heading, Text, VStack } from "native-base";

import { ExerciseCard } from "@components/Exercise/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/Home/HomeHeader";

export function Home() {
  const [groups, setGroups] = useState(["peito", "ombro", "costas", "pernas"]);
  const [exercises, setExercises] = useState(["1", "2", "3", "4"]);
  const [groupSelected, setGroupSelected] = useState("peito");

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            onPress={() => setGroupSelected(item)}
            name={item}
            isActive={
              String(groupSelected).toUpperCase() === String(item).toUpperCase()
            }
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={4}
        maxH={10}
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
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ExerciseCard />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}
