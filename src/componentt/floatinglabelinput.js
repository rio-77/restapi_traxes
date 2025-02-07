import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';

const OutlinedInput = ({ label, value, onChangeText, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value !== '' ? 1 : 0,
      duration: 150,
      useNativeDriver: false, // karena kita meng-animasi properti top dan fontSize
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 12,
    // Saat input kosong, label berada di dalam kotak (posisi 18),
    // dan saat fokus atau terisi, label naik ke atas (posisi -8)
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    // Ukuran font label mengecil saat naik
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    // Memberikan background agar label tampak menutupi border
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#1C4966'],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingTop: 18, // memberi ruang bagi label untuk mengapung
  },
  input: {
    height: 50,            // tinggi input tetap
    fontSize: 16,
    color: '#000',
    borderWidth: 1,        // garis penuh (outlined)
    borderColor: '#1C4966',
    borderRadius: 8,       // sudut membulat
    paddingHorizontal: 12, // jarak dalam terhadap sisi kiri/kanan
  },
});

export default OutlinedInput;
