import { Center, Image, VStack, Text, Heading } from "native-base";
import gymImg from "@assets/gym.png";
import { Input } from "@components/Input";

export function SignIn() {
  return (
    <VStack flex={1} bg={"gray.900"}>
      <Image
        source={gymImg}
        alt="gym"
        resizeMode="contain"
        position="absolute"
        opacity={40}
      />

      <Center my={24}>
        <Text
          fontSize={48}
          color={"#fff"}
          fontFamily={"heading"}
          display="flex"
        >
          Gymni
        </Text>
        <Text fontSize={18} color={"#fff"} fontFamily={"body"}>
          Acompanhe seu desempenho na academia
        </Text>
      </Center>

      <Center px="12">
        <Heading color="gray.200" fontSize="2xl" mb={6} fontFamily="heading">
          Acessar conta
        </Heading>

        <Input placeholder="Email" keyboardType="email-address" />

        <Input placeholder="Senha" secureTextEntry />
      </Center>
    </VStack>
  );
}
