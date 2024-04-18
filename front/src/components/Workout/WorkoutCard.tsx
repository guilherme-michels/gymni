import { HStack, Heading, Text, VStack } from "native-base";
import { WorkoutDTO } from "@dtos/WorkoutDTO";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

type WorkoutCardProps = {
  workout: WorkoutDTO;
};

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <HStack
      w={"full"}
      px={5}
      py={4}
      mt={4}
      bg={"gray.600"}
      rounded={"md"}
      mb={2}
      alignItems={"center"}
      justifyContent={"centere"}
    >
      <VStack flex={1}>
        <Heading
          color={"gray.100"}
          fontSize={"md"}
          textTransform={"capitalize"}
          numberOfLines={1}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {workout.description}
        </Heading>
        <Text color={"gray.200"} fontSize={"lg"} numberOfLines={1}>
          {workout.exercises &&
            workout.exercises
              .map((exercise: ExerciseDTO) => exercise.name)
              .join(", ")}
        </Text>
      </VStack>

      <Text color={"gray.300"} fontSize={"md"}>
        {workout.last_completed_at}
      </Text>
    </HStack>
  );
}
