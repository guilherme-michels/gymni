import { Box, useTheme } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { useAuth } from "@hooks/useAuth";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { Loading } from "@components/Loading";

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoadingLoggedUserData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[900];

  if (isLoadingLoggedUserData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg={"gray.900"}>
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
