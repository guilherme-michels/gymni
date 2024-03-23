import {
  Image,
  HStack,
  Heading,
  Text,
  VStack,
  Box,
  ScrollView,
} from "native-base";

import { Button } from "@components/Button";

import RepeatSvg from "@assets/repeat.svg";
import DumbbellSvg from "@assets/dumbbell.svg";

export function Exercise() {
  return (
    <VStack flex={1}>
      <HStack bg={"gray.600"} pb={6} pt={16} justifyContent={"space-between"}>
        <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
          Puxada frontal
        </Heading>

        <Text color={"gray.200"} ml={1} textTransform={"capitalize"}>
          Costas
        </Text>
      </HStack>

      <ScrollView>
        <VStack p={8}>
          <Image
            w={"full"}
            h={80}
            source={{
              uri: "https://blog.lionfitness.com.br/wp-content/uploads/2019/01/Blog-75-1.jpg",
            }}
            alt="exercise image"
            mb={3}
            resizeMode="cover"
            rounded={"lg"}
          />

          <Box px={4} bg={"gray.600"} pb={6} py={4} rounded={"lg"}>
            <HStack
              rounded={"md"}
              mb={6}
              alignItems={"center"}
              justifyContent={"space-around"}
            >
              <HStack>
                <DumbbellSvg width={14} fill={"#fff"} stroke="#fff" />
                <Text color={"gray.100"} ml={2}>
                  4 Séries
                </Text>
              </HStack>

              <HStack>
                <RepeatSvg width={14} fill={"#fff"} stroke="#fffff" />
                <Text color={"gray.100"} ml={2}>
                  12 Repetições
                </Text>
              </HStack>
            </HStack>

            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
