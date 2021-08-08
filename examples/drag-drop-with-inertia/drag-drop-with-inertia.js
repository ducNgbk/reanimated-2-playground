import React from 'react';
import {Dimensions, SafeAreaView, StyleSheet} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {ViewStyle} from 'react-native';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const BOX_SIZE = 60;

const DragDropWithInertia: React.FC<{}> = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      ctx.lastEvents = [
        {
          date: Date.now(),
          translationX: event.translationX,
          translationY: event.translationY,
        },
      ];
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
      if (ctx.lastEvents.length === 2) {
        ctx.lastEvents.shift();
      }
      ctx.lastEvents.push({
        date: Date.now(),
        translationX: event.translationX,
        translationY: event.translationY,
      });
    },
    onEnd: (event, ctx) => {
      const lastEvent = ctx.lastEvents[0];
      const currentEvent = event;
      const deltaTime = Date.now() - lastEvent.date;
      const deltaX = currentEvent.translationX - lastEvent.translationX;
      const deltaY = currentEvent.translationY - lastEvent.translationY;
      const velocityX = deltaX / deltaTime; // dp/ms
      const velocityY = deltaY / deltaTime; // dp/ms

      const deceleration = 0.998;
      translateX.value = withDecay({
        velocity: velocityX * 300, // not sure why event.velocityX/Y is always 0 => have to manually calculate velocity
        deceleration,
        clamp: [0, SCREEN_WIDTH - BOX_SIZE],
      });
      translateY.value = withDecay({
        velocity: velocityY * 300,
        deceleration,
        clamp: [0, SCREEN_HEIGHT - BOX_SIZE],
      });
    },
  });

  const boxUAS = useAnimatedStyle((): ViewStyle => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <SafeAreaView style={styles.screenContainer}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.box, boxUAS]} />
      </PanGestureHandler>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  box: {
    marginLeft: 10,
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: 'rgba(0, 200, 124, 0.4)',
  },
});

export default DragDropWithInertia;
