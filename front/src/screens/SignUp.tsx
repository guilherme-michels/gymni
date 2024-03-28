import React, { useState } from "react";

import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { registerAccount } from "src/api/auth.service";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  VStack,
  Image,
  Text,
  Center,
  View,
  ScrollView,
  useToast,
} from "native-base";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";

import gymImg from "@assets/gym.png";
import dumbbellImg from "@assets/dumbbell.png";

type SignUpDataProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const signUpSchema = yup.object({
  name: yup.string().required("Nome é obrigatório."),
  email: yup.string().required("Email é obrigatório.").email("Email inválido."),
  password: yup
    .string()
    .required("Senha é obrigatória.")
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: yup
    .string()
    .required("Confirme a senha...")
    .oneOf([yup.ref("password"), ""], "A confirmação de senha não confere."),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const toast = useToast();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ email, name, password }: SignUpDataProps) {
    try {
      setIsLoading(true);

      await registerAccount({
        email,
        name,
        password,
      });

      await signIn(email, password);

      reset();
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar a conta";

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
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Registrar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt="auto" mb="12">
          <Text fontSize={14} color={"blue.100"} fontFamily={"body"} mb={2}>
            Já possui conta?
          </Text>

          <Button
            title="Voltar para o login"
            variant={"outline"}
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
