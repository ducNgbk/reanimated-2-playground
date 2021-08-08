import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import PartialRing from './partial-ring';
import {PanGestureHandler} from 'react-native-gesture-handler';

interface Props {
  outerRadius: number;
  innerRadius: number;
}

const COLOR_PAIRS = [
  {highlight: '#e33371', background: '#4791db'},
  {highlight: '#dc004e', background: '#1976d2'},
  {highlight: '#9a0036', background: '#115293'},
  {highlight: '#ffb74d', background: '#64b5f6'},
];

const TrackerRing: React.FC<Props> = ({innerRadius, outerRadius}) => {
  const ringCenter = useSharedValue(null);
  const rotate = useSharedValue(0);
  const [highlightColor, setHighlightColor] = useState(
    COLOR_PAIRS[0].highlight,
  );
  const [backgroundColor, setBackgroundColor] = useState(
    COLOR_PAIRS[0].background,
  );

  const pointerUAS = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotate.value}deg`,
        },
      ],
    };
  });

  const changeColor = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * COLOR_PAIRS.length);
    setHighlightColor(COLOR_PAIRS[randomIndex].highlight);
    setBackgroundColor(COLOR_PAIRS[randomIndex].background);
  }, []);

  const pointerRadius = useMemo(() => {
    return (outerRadius - innerRadius) / 2;
  }, [outerRadius, innerRadius]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_) => {},
    onActive: (event) => {
      if (!ringCenter.value) {
        return;
      }
      const {absoluteX, absoluteY} = event;
      const angleRad = Math.atan2(
        absoluteY - ringCenter.value.y,
        absoluteX - ringCenter.value.x,
      );
      let angleDeg = (angleRad * 180) / Math.PI;
      while (angleDeg < 0) {
        angleDeg += 360;
      }
      // Pass break point
      const offset = 30;
      if (
        (rotate.value > 360 - offset &&
          rotate.value < 360 &&
          angleDeg >= 0 &&
          angleDeg < offset) ||
        (rotate.value > 0 &&
          rotate.value < offset &&
          angleDeg <= 360 &&
          rotate.value > 360 - offset)
      ) {
        // Request change color
        runOnJS(changeColor)();
      }

      rotate.value = angleDeg;
    },
  });

  const onLayout = useCallback(
    (e) => {
      const {x, y, width, height} = e.nativeEvent.layout;
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      ringCenter.value = {x: centerX, y: centerY};
    },
    [ringCenter],
  );

  return (
    <View onLayout={onLayout} style={styles.container}>
      <PartialRing
        openColor={highlightColor}
        color={backgroundColor}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        openDegree={rotate}
      />
      <Animated.View
        style={[
          styles.pointerContainer,
          {
            width: outerRadius * 2,
          },
          pointerUAS,
        ]}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.pointerOuterRing,
              {
                height: pointerRadius * 2,
                width: pointerRadius * 2,
                borderRadius: pointerRadius,
              },
            ]}>
            <View
              style={{
                height: pointerRadius * 2 - 10,
                width: pointerRadius * 2 - 10,
                borderRadius: pointerRadius * 2,
                backgroundColor: highlightColor,
              }}
            />
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center'},
  pointerContainer: {
    position: 'absolute',
    alignItems: 'flex-end',
  },
  pointerOuterRing: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

TrackerRing.defaultProps = {
  outerRadius: 150,
  innerRadius: 100,
};

export default TrackerRing;
