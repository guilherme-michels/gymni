import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from "native-base";

type InputProps = IInputProps & {
  errorMessage?: string | null;
  type?: string; 
};

export function Input({ errorMessage = null, isInvalid, type = "text", ...rest }: InputProps) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        type={type} 
        background={"#0000000"}
        h={12}
        px={4}
        borderWidth={1}
        borderColor={"blue.200"}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor={"#cacaca"}
        _focus={{
          bg: "#ffffff30",
          borderWidth: 1,
          borderColor: "blue.300",
        }}
        {...rest}
      />

      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
