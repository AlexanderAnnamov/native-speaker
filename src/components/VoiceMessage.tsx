import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

const VoiceMessage = ({ audioUri, isUserMessage }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        stopSound();
        setIsPlaying(false);
      }
    });

    await sound.playAsync();
    setIsPlaying(true);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  return (
    <View
      style={{
        marginBottom: 16,
        flex: 1,
        alignItems: isUserMessage ? "flex-end" : "flex-start",
      }}
    >
      {isPlaying ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#D1D1D1",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 8,
          }}
          onPress={stopSound}
        >
          <Text>Остановить воспроизведение</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: "#D1D1D1",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 8,
          }}
          onPress={playSound}
        >
          <Text style={{}}>Воспроизвести голосовое сообщение</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VoiceMessage;
