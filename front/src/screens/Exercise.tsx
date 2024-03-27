import { api } from "src/api";

import { useEffect, useState } from "react";

import {
  Image,
  HStack,
  Heading,
  Text,
  VStack,
  Box,
  ScrollView,
  useToast,
  Skeleton,
} from "native-base";

import { Button } from "@components/Button";
import { useRoute } from "@react-navigation/native";

import RepeatSvg from "@assets/repeat.svg";
import DumbbellSvg from "@assets/dumbbell.svg";
import { AppError } from "@utils/AppError";
import { addExerciseRegister, getExerciseById } from "src/api/exercise.service";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

type ExerciseRouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const [sendingRegister, setIsSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const toast = useToast();

  const { exerciseId } = route.params as ExerciseRouteParamsProps;

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);

      const response = await getExerciseById(exerciseId);
      setExercise(response);
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

  async function handleExerciseHistoryRegister() {
    try {
      setIsSendingRegister(true);

      await addExerciseRegister(exerciseId);

      toast.show({
        title: "Exercício registrado.",
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

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <HStack
        px={12}
        bg={"gray.600"}
        pb={6}
        pt={16}
        justifyContent={"space-between"}
      >
        <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
          {exercise.name}
        </Heading>

        <Text color={"gray.200"} ml={1} textTransform={"capitalize"}>
          {exercise.group}
        </Text>
      </HStack>
      {isLoading ? (
        <Skeleton rounded={"lg"} h={"96"} p={8} startColor={"gray.500"} />
      ) : (
        <ScrollView>
          <VStack p={8}>
            <Image
              w={"full"}
              h={80}
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
              }}
              alt="exercise image"
              mb={3}
              resizeMode="cover"
              rounded={"lg"}
            />

            <Box px={4} bg={"gray.600"} pb={6} py={4} rounded={"lg"}>
              <HStack
                rounded={"md"}
                mb={6}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                <HStack>
                  <DumbbellSvg width={14} fill={"#fff"} stroke="#fff" />
                  <Text color={"gray.100"} ml={2}>
                    {exercise.series} Séries
                  </Text>
                </HStack>

                <HStack>
                  <RepeatSvg width={14} fill={"#fff"} stroke="#fff" />
                  <Text color={"gray.100"} ml={2}>
                    {exercise.repetitions} Repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
