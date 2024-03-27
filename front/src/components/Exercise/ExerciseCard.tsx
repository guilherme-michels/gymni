import {
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  Icon,
  Skeleton,
} from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "src/api";

type ExerciseCardProps = TouchableOpacityProps & {
  exercise: ExerciseDTO;
  isLoading: boolean;
};

export function ExerciseCard({
  isLoading,
  exercise,
  ...rest
}: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      {!isLoading ? (
        <Skeleton rounded={"md"} h={20} startColor={"gray.500"} />
      ) : (
        <HStack
          bg={"gray.600"}
          alignItems={"center"}
          p={2}
          pr={4}
          rounded={"md"}
          mb={3}
          h={20}
        >
          <Image
            source={{
              uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`,
            }}
            alt="exerciseImg"
            w={16}
            h={16}
            rounded={"md"}
            mr={4}
            resizeMode="cover"
          />
          <VStack flex={1}>
            <Heading fontSize={"lg"} color={"gray.100"}>
              {exercise.name}
            </Heading>

            <Text fontSize={"sm"} color={"gray.300"} numberOfLines={2}>
              {exercise.series} séries x {exercise.repetitions} repetições
            </Text>
          </VStack>

          <Icon as={Entypo} name="chevron-thin-right" color={"gray.300"} />
        </HStack>
      )}
    </TouchableOpacity>
  );
}
