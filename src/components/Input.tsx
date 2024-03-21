import { Input as NativeBaseInput, IInputProps } from "native-base";

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="gray.400"
      h={12}
      px={4}
      borderWidth={0}
      fontSize="md"
      color="white"
      fontFamily="body"
      mb="4"
      _focus={{
        bg: "gray.900",
        borderWidth: 1,
        borderColor: "gray.400",
      }}
      {...rest}
    />
  );
}
