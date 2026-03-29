import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import StudentsScreen from "../screens/StudentsScreen";
import SubjectsScreen from "../screens/SubjectsScreen";
import TeachersScreen from "../screens/TeachersScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <TouchableOpacity onPress={() => logout()} style={{ marginRight: 16 }}>
      <Text style={{ color: "#2563eb", fontWeight: "600" }}>Logout</Text>
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <LogoutButton />,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tab.Screen
        name="StudentsTab"
        component={StudentsScreen}
        options={{ title: "Students" }}
      />
      <Tab.Screen
        name="SubjectsTab"
        component={SubjectsScreen}
        options={{ title: "Subjects" }}
      />
      <Tab.Screen
        name="TeachersTab"
        component={TeachersScreen}
        options={{ title: "Teachers" }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
