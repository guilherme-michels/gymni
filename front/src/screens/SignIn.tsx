import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, View, ScrollView } from "native-base";

import { AuthNavigatorRouteProps } from "@routes/auth.routes";

import gymImg from "@assets/gym.png";
import dumbbellImg from "@assets/dumbbell.png";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRouteProps>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} position="relative" px={12} pb={14}>
        <Image
          source={gymImg}
          defaultSource={gymImg}
          alt="gym"
          resizeMode="contain"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.4}
          zIndex={-1}
        />

        <Center mt={"48"}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Image source={dumbbellImg} alt="dumbbell" height={14} width={14} />

            <Text
              fontSize={44}
              color={"blue.100"}
              fontFamily={"heading"}
              display="flex"
            >
              Gymni Pro
            </Text>
          </View>
          <Text fontSize={18} color={"blue.200"} fontFamily={"body"} mb={8}>
            Acompanhe seu desempenho na academia
          </Text>

          <Input placeholder="Email" keyboardType="email-address" />

          <Input placeholder="Senha" secureTextEntry />

          <Button title="Acessar" />
        </Center>

        <Center mt="auto" mb="12">
          <Text fontSize={14} color={"blue.100"} fontFamily={"body"} mb={2}>
            Não possui conta?
          </Text>

          <Button
            title="Cadastre-se"
            variant={"outline"}
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
