import { View, StyleSheet, Button } from "react-native";

import ChatScreen from "./src/pages/ChatPage";

export default function App() {
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#252525",
    padding: 10,
    color: "red",
  },
});
