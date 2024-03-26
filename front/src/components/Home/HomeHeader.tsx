import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@hooks/useAuth";

import userDefaultImg from "@assets/userDefault.jpg";

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack bg={"gray.600"} pt={16} pb={5} px={8} alignItems={"center"}>
      <UserPhoto
        source={user.avatar ? { uri: user.avatar } : userDefaultImg}
        size={12}
        alt="user photo"
        mr={4}
      />
      <VStack flex={1}>
        <Text color={"gray.100"} fontSize={"sm"}>
          Olá,
        </Text>

        <Heading color={"gray.200"} fontSize={"md"}>
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={MaterialIcons} name="logout" color={"gray.200"} size={5} />
      </TouchableOpacity>
    </HStack>
  );
}
