import { useState } from "react";
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  useToast,
} from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/Home/UserPhoto";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";

type ProfileDataProps = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  confirmPassword: string;
};

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  const toast = useToast();
  const { user } = useAuth();

  const { control } = useForm<ProfileDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
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

      if (selectedPhoto.assets[0].uri) {
        setUserPhoto(selectedPhoto.assets[0].uri);

        toast.show({
          title: "Foto alterada",
          placement: "top",
          bgColor: "green.400",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
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
              source={{ uri: userPhoto! }}
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
              <Input placeholder="Nome" onChangeText={onChange} value={value} />
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
          <Input placeholder="Senha atual" secureTextEntry />

          <Input placeholder="Nova senha" secureTextEntry />

          <Input placeholder="Confirmar senha" secureTextEntry />

          <Button title="Atualizar" />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
