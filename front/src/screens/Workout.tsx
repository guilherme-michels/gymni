import { VStack } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";

export function Workout() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Meus treinos" />
    </VStack>
  );
}
