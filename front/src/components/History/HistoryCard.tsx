import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons";

type HistoryCardProps = TouchableOpacityProps & {};

export function HistoryCard({ ...rest }: HistoryCardProps) {
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
          Costas
        </Heading>
        <Text color={"gray.200"} fontSize={"lg"} numberOfLines={1}>
          Puxada frontal
        </Text>
      </VStack>

      <Text color={"gray.300"} fontSize={"md"}>
        8:56
      </Text>
    </HStack>
  );
}
