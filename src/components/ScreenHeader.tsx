import { Center, Heading } from "native-base";

type ScreenHeaderProps = {
  title: string;
};

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <Center bg={"gray.600"} pb={6} pt={16}>
      <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
        {title}
      </Heading>
    </Center>
  );
}
