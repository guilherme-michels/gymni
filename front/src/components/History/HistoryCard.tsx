import { HStack, Heading, Text, VStack } from "native-base";
import { HistoryDTO } from "@dtos/HistoryDTO";

type HistoryCardProps = {
  history: HistoryDTO;
};

export function HistoryCard({ history }: HistoryCardProps) {
  return (
    <HStack
      w={"full"}
      px={5}
      py={4}
      bg={"gray.600"}
      rounded={"md"}
      mb={2}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <VStack mr={5} flex={1}>
        <Heading
          color={"gray.100"}
          fontSize={"md"}
          textTransform={"capitalize"}
          numberOfLines={1}
        >
          {history.group}
        </Heading>
        <Text color={"gray.200"} fontSize={"lg"} numberOfLines={1}>
          {history.name}
        </Text>
      </VStack>

      <Text color={"gray.300"} fontSize={"md"}>
        {history.hour}
      </Text>
    </HStack>
  );
}
