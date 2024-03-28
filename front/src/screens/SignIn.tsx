import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Text,
  Center,
  View,
  ScrollView,
  useToast,
} from "native-base";

import { AuthNavigatorRouteProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useForm, Controller } from "react-hook-form";
import { AppError } from "@utils/AppError";

import gymImg from "@assets/gym.png";
import dumbbellImg from "@assets/dumbbell.png";

type SignInFormData = {
  email: string;
  password: string;
};

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRouteProps>();
  const { signIn } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  async function handleSignIn({ email, password }: SignInFormData) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : "Não foi possível entrar.";

      setIsLoading(false);

      toast.show({
        title,
        placement: "top",
        bgColor: "red.400",
      });
    }
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
          <Controller
            control={control}
            name="email"
            rules={{ required: "Informe o email" }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: "Informe a senha" }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
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
