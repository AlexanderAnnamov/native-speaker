import React, { useState, Fragment } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import io from "socket.io-client";
import { Audio } from "expo-av";
import VoiceMessage from "../components/VoiceMessage";

const socket = io("http://localhost:3000"); // Поменяйте your-server-ip на свой IP-адрес сервера

const ChatScreen = () => {
  const [voiceMessages, setVoiceMessages] = useState([]);

  const [recording, setRecording] = useState(null);

  const startRecording = async () => {
    const newRecording = new Audio.Recording();

    try {
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.log("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const audioData = { uri, isAudio: true }; // Добавляем isAudio для обозначения аудиофайла

      socket.emit("audio", audioData);
      setRecording(null);
      setVoiceMessages([
        ...voiceMessages,
        { ...audioData, isUserMessage: true },
      ]);
    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

  socket.on("audio", (audioData) => {
    setVoiceMessages([{ uri: audioData.uri, isAudio: true }, ...voiceMessages]);
  });

  socket.on("audioResponse", (audioData) => {
    // Получаем звуковую дорожку от сервера
    // audioData содержит данные о звуковой дорожке в формате .wav
    // Здесь вы можете воспроизвести звуковую дорожку или обработать её
    setVoiceMessages([
      ...voiceMessages,
      { ...audioData, isUserMessage: false },
    ]);
    console.log("Received audio track from server", audioData);

    // Например, воспроизведение звуковой дорожки
  });

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {voiceMessages?.map(({ uri, isUserMessage }) => {
          return (
            <View key={uri}>
              <VoiceMessage audioUri={uri} isUserMessage={isUserMessage} />
            </View>
          );
        })}
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
          <Text style={styles.recordButtonText}>Записать</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={stopRecording}>
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    // borderTopColor: "#ccc",
  },
  recordButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  recordButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sendButton: {
    backgroundColor: "#3f51b5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatScreen;
