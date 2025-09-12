import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

const LiquidProgress = ({ progress, color, backgroundColor, size = CIRCLE_SIZE }) => {
  const fillAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the fill height
    Animated.timing(fillAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const fillHeight = fillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size],
  });

  return (
    <View style={{ 
      position: 'absolute', 
      width: size, 
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
      backgroundColor: backgroundColor,
    }}>
      {/* Liquid fill */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: fillHeight,
          bottom: 0,
          left: 0,
          backgroundColor: color,
          opacity: 0.8,
        }}
      />
    </View>
  );
};

export default LiquidProgress;
