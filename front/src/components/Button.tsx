import { Button as NativeBaseButton, IButtonProps, Text } from "native-base";

interface ButtonProps extends IButtonProps {
  title: string;
  variant?: "solid" | "outline";
}

export function Button({ title, variant = "solid", ...rest }: ButtonProps) {
  return (
    <NativeBaseButton
      width="full"
      h={12}
      bg={variant === "outline" ? "transparent" : "blue.400"}
      borderWidth={1}
      borderColor={"blue.400"}
      _pressed={{
        bg: "blue.300",
      }}
      {...rest}
    >
      <Text
        color={variant === "outline" ? "blue.400" : "white"}
        fontFamily={"heading"}
        fontSize={"lg"}
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}
