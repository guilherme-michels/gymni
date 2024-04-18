import { HStack, Heading, Text, VStack } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { WorkoutDTO } from "@dtos/WorkoutDTO";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { formatDate } from "@utils/utils";

type WorkoutCardProps = TouchableOpacityProps & {
  workout: WorkoutDTO;
};

export function WorkoutCard({ workout, ...rest }: WorkoutCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        w={"full"}
        px={5}
        py={4}
        mt={4}
        bg={"gray.600"}
        rounded={"md"}
        mb={2}
        alignItems={"center"}
        justifyContent={"center"}
        borderLeftColor={"blue.600"}
        borderLeftWidth={8}
      >
        <VStack flex={1}>
          <Heading
            color={"gray.100"}
            fontSize={"lg"}
            textTransform={"capitalize"}
            numberOfLines={1}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {workout.description}
          </Heading>

          <Text color={"gray.200"} fontSize={"md"} mt={2} mb={2}>
            {workout.exercises &&
              workout.exercises
                .map((exercise: ExerciseDTO) => exercise.name)
                .join(", ")}
          </Text>

          <Text color={"gray.300"} fontSize={"sm"}>
            Realizado última vez em: {formatDate(workout.last_completed_at!)}
          </Text>

          <Text color={"gray.300"} fontSize={"sm"}>
            Realizado {workout.times_completed} vezes
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
