import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
const ResumeScreen = () => {
  // Membuat Animated.Value sebagai nilai awal animasi
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Mengatur animasi naik-turun secara berulang
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  // Menginterpolasi nilai animasi untuk mengubah posisi vertical
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30], // Teks akan bergerak ke atas sejauh 30 piksel
  });
  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.animatedText, { transform: [{ translateY }] }]}>
        Progres
      </Animated.Text>
      <Animated.Text style={[styles.animatedText, { transform: [{ translateY }] }]}>
        Maintenance
      </Animated.Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20,  
    backgroundColor: 'white' 
  },
  animatedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#274366',
    marginVertical: 0,
  },
});
export default ResumeScreen;


