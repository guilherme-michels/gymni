import { useState } from "react";
import { api } from "src/api";

import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  useToast,
} from "native-base";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/Home/UserPhoto";

import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { updateProfile, updateUserImage } from "src/api/profile.service";
import { AppError } from "@utils/AppError";

import userDefaultImg from "@assets/userDefault.jpg";

type ProfileDataProps = {
  name: string;
  email?: string;
  password: string;
  oldPassword: string;
  confirmPassword: string;
};

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), ""], "A confirmação de senha não confere."),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      oldPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(profileSchema) as any,
  });

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);

    try {
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (selectedPhoto.canceled) {
        return;
      }

      const fileExtension = selectedPhoto.assets[0].uri.split(".").pop();

      const photoFile = {
        name: `${user.name}.${fileExtension}`.toLowerCase(),
        uri: selectedPhoto.assets[0].uri,
        type: `${selectedPhoto.assets[0].type}/${fileExtension}`,
      } as any;

      const userPhotoUploadForm = new FormData();
      userPhotoUploadForm.append("avatar", photoFile);

      const response = await updateUserImage(userPhotoUploadForm);

      const userUpdated = user;
      userUpdated.avatar = response.avatar;
      updateUserProfile(userUpdated);

      toast.show({
        title: "Foto alterada",
        placement: "top",
        bgColor: "green.400",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: ProfileDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await updateProfile({
        name: data.name,
        oldPassword: data.oldPassword,
        password: data.password,
      });

      await updateUserProfile(userUpdated);

      toast.show({
        title: "Perfil atualizado",
        placement: "top",
        bgColor: "green.400",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os dados.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.400",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              size={32}
              rounded={"full"}
              startColor={"gray.500"}
              endColor={"gray.600"}
            />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : userDefaultImg
              }
              size={32}
              alt="user photo"
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color={"blue.400"} mt={2} mb={8} fontSize={"md"}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
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
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Email"
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                isDisabled
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Text color={"gray.100"} mb={2}>
            Alterar senha
          </Text>

          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha atual"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Confirmar nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
