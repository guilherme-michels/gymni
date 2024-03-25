import { HistoryCard } from "@components/History/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, SectionList, Text, VStack } from "native-base";
import { useState } from "react";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "AAA",
      data: ["1", "2", "3"],
    },
    {
      title: "BBB",
      data: ["1", "2", "3"],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de treinos" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        px={8}
        renderSectionHeader={({ section }) => (
          <Heading color={"gray.100"} fontSize={"md"} mt={8} mb={2}>
            {section.title}
          </Heading>
        )}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color={"gray.100"} textAlign={"center"}>
            Não há exercícios registrados ainda.
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
