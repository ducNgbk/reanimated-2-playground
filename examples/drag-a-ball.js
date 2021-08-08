import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {ViewStyle} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';

const DragABall: React.FC<{}> = () => {
  const pressed = useSharedValue(false);
  const startingPosition = 0;
  const x = useSharedValue(startingPosition);
  const y = useSharedValue(startingPosition);

  const gestureEventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      pressed.value = false;
    },
  });

  const ballAnimatedStyle = useAnimatedStyle((): ViewStyle => {
    return {
      backgroundColor: pressed.value ? '#FEEF86' : '#001972',
      transform: [
        {scale: withSpring(pressed.value ? 1.2 : 1)},
        {translateX: x.value},
        {translateY: y.value},
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureEventHandler}>
        <Animated.View style={[styles.ball, ballAnimatedStyle]} />
      </PanGestureHandler>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ball: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
});

export default DragABall;
