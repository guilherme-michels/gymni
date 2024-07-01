import { Platform } from "react-native";
import { useTheme } from "native-base";

import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { Exercise } from "@screens/Exercise";
import { History } from "@screens/History";
import { Home } from "@screens/Home";
import { Profile } from "@screens/Profile";
import { Workout } from "@screens/Workouts/Workout";
import { WorkoutsList } from "@screens/Workouts/WorkoutsList";

import ProfileSvg from "@assets/profile.svg";
import HomeSvg from "@assets/home.svg";
import HistorySvg from "@assets/history.svg";
import WorkoutsSvg from "@assets/workouts.svg";
import { WorkoutForm } from "@screens/Workouts/WorkoutForm";

type AppRoutes = {
  home: undefined;
  exercise: { exerciseId: string };
  profile: undefined;
  history: undefined;
  workout: { workoutId: string };
  workoutsList: undefined;
  workoutForm: { workoutId?: string };
};

export type AppNavigatorRouteProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: colors.gray[300],
        tabBarActiveTintColor: colors.blue[400],
        tabBarStyle: {
          backgroundColor: colors.gray[700],
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="exercise"
        component={Exercise}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Screen
        name="workoutsList"
        component={WorkoutsList}
        options={{
          tabBarIcon: ({ color }) => (
            <WorkoutsSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="workout"
        component={Workout}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Screen
        name="workoutForm"
        component={WorkoutForm}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
    </Navigator>
  );
}
