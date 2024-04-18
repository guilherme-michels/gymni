import { Center, HStack, Heading, Text } from "native-base";
import { TouchableOpacity } from "react-native";

type ScreenHeaderProps = {
  title: string;
  onClick?: () => void;
};

export function ScreenHeader({ title, onClick }: ScreenHeaderProps) {
  return (
    <HStack
      bg={"gray.600"}
      pt={16}
      pb={5}
      px={8}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
        {title}
      </Heading>

      {onClick && (
        <TouchableOpacity onPress={onClick}>
          <Text color={"blue.500"}>Adicionar</Text>
        </TouchableOpacity>
      )}
    </HStack>
  );
}
