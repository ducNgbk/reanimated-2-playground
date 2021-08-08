import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {Dimensions, StyleSheet, View} from 'react-native';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const SQUARE_SIZE = SCREEN_WIDTH * 0.6;

interface Props {
  title: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const Page: React.FC<Props> = ({index, title, scrollX}) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const squareUAS = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP,
    );

    const borderRadius = interpolate(
      scrollX.value,
      inputRange,
      [0, SQUARE_SIZE / 2, 0],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      transform: [{scale}],
    };
  });

  const titleUAS = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP,
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [SCREEN_HEIGHT / 2, 0, -SCREEN_HEIGHT / 2],
      Extrapolate.CLAMP,
    );

    return {opacity, transform: [{translateY}]};
  });

  return (
    <View
      style={[
        styles.pageContainer,
        {
          backgroundColor: `rgba(0,0,256,0.${index + 2})`,
        },
      ]}>
      <Animated.View style={[styles.square, squareUAS]} />
      <Animated.Text style={[styles.title, titleUAS]}>{title}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    height: SQUARE_SIZE,
    width: SQUARE_SIZE,
    backgroundColor: 'rgba(0,0,256,0.4)',
  },
  title: {
    position: 'absolute',
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
  },
});

export default Page;
