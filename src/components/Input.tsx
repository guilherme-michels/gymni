import { Input as NativeBaseInput, IInputProps } from "native-base";

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      background={"#0000000"}
      h={12}
      px={4}
      borderWidth={1}
      borderColor={"blue.200"}
      fontSize="md"
      color="white"
      fontFamily="body"
      mb="4"
      placeholderTextColor={"#cacaca"}
      _focus={{
        bg: "#ffffff30",
        borderWidth: 1,
        borderColor: "blue.300",
      }}
      {...rest}
    />
  );
}
