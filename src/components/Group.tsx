import { Text, Pressable, IPressableProps } from "native-base";

type GroupPros = IPressableProps & {
  name: string;
  isActive: boolean;
};

export function Group({ name, isActive, ...rest }: GroupPros) {
  return (
    <Pressable
      mr={3}
      w={24}
      h={10}
      bg={"gray.600"}
      rounded={"md"}
      alignItems={"center"}
      justifyContent={"center"}
      overflow={"hidden"}
      isPressed={isActive}
      _pressed={{
        borderWidth: 1,
        borderColor: "blue.400",
      }}
      {...rest}
    >
      <Text
        textTransform={"uppercase"}
        color={isActive ? "blue.400" : "gray.200"}
        fontSize={"xs"}
        fontWeight={"bold"}
      >
        {name}
      </Text>
    </Pressable>
  );
}
