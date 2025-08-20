import { Platform } from "react-native";

export function errorToast(message: string) {
  if (Platform.OS === "web") {
    alert(message); // fallback for web
  } else {
    import("react-native-toast-message").then(({ default: Toast }) => {
      Toast.show({
        type: "error",
        text1: message,
      });
    });
  }
}
