import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Set EXPO_PUBLIC_API_BASE_URL in .env when Expo tunnel hides your LAN IP, or to override.
 * Physical device + Expo Go: same host as the dev server (from debuggerHost) on port 5048.
 * Emulator: Android → 10.0.2.2, iOS simulator → localhost.
 */
function isPrivateLanIpv4(host: string): boolean {
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
}

function baseUrlFromDebuggerHost(debuggerHost: string | undefined): string | null {
  if (!debuggerHost) return null;
  const hostPart = debuggerHost.split(":")[0];
  if (isPrivateLanIpv4(hostPart)) {
    return `http://${hostPart}:5048`;
  }
  if (hostPart === "localhost" || hostPart === "127.0.0.1") {
    return "http://localhost:5048";
  }
  return null;
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const fromDebugger = baseUrlFromDebuggerHost(Constants.expoGoConfig?.debuggerHost);
  if (fromDebugger) return fromDebugger;

  const isDevice = Constants.isDevice === true;

  if (Platform.OS === "android" && !isDevice) {
    return "http://10.0.2.2:5048";
  }
  if (Platform.OS === "ios" && !isDevice) {
    return "http://localhost:5048";
  }

  // Physical device + Expo tunnel (no LAN IP in debuggerHost): set EXPO_PUBLIC_API_BASE_URL
  return "http://localhost:5048";
}
