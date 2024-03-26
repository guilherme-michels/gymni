import { Spinner, Center } from "native-base";

export function Loading() {
  return (
    <Center flex={1} bg={"gray.900"}>
      <Spinner />
    </Center>
  );
}
