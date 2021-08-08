import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

interface Props {
  outerRadius: number;
  innerRadius: number;
  color: string;
  innerColor: string;
  openColor: string;
  openDegree: Animated.SharedValue<number>;
}

const PartialRing: React.FC<Props> = ({
  color,
  innerColor,
  openColor,
  innerRadius,
  outerRadius,
  openDegree,
}) => {
  const upperRotateUAS = useAnimatedStyle(() => {
    const degree = openDegree.value % 360;
    let rotate;
    if (degree < 180) {
      rotate = 0;
    } else {
      rotate = degree - 180;
    }
    return {
      transform: [
        {translateY: -outerRadius / 2},
        {rotate: `${rotate}deg`},
        {translateY: outerRadius / 2},
      ],
    };
  });

  const lowerRotateUAS = useAnimatedStyle(() => {
    const degree = openDegree.value % 360;
    let rotate;
    if (degree < 180) {
      rotate = degree;
    } else {
      rotate = 180;
    }
    return {
      transform: [
        {translateY: outerRadius / 2},
        {rotate: `${rotate}deg`},
        {translateY: -outerRadius / 2},
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Upper circle */}
      <View
        style={[
          styles.halfCircleContainer,
          {
            width: outerRadius * 2,
            height: outerRadius,
          },
        ]}>
        <View
          style={[
            styles.upperCircle,
            {
              width: outerRadius * 2,
              height: outerRadius * 2,
              borderRadius: outerRadius,
              backgroundColor: color,
            },
          ]}>
          <Animated.View
            style={[
              {
                width: outerRadius * 2,
                height: outerRadius,
                backgroundColor: openColor,
              },
              upperRotateUAS,
            ]}
          />
        </View>
      </View>
      {/* Lower circle */}
      <View
        style={[
          styles.halfCircleContainer,
          styles.lowerCircleContainer,
          {
            width: outerRadius * 2,
            height: outerRadius,
          },
        ]}>
        <View
          style={[
            styles.lowerCircle,
            {
              width: outerRadius * 2,
              height: outerRadius * 2,
              borderRadius: outerRadius,
              backgroundColor: color,
            },
          ]}>
          <Animated.View
            style={[
              {
                width: outerRadius * 2,
                height: outerRadius,
                backgroundColor: openColor,
              },
              lowerRotateUAS,
            ]}
          />
        </View>
      </View>
      {/* Inner cycle */}
      <View
        style={[
          styles.innerCircle,
          {
            width: innerRadius * 2,
            height: innerRadius * 2,
            borderRadius: innerRadius,
            backgroundColor: innerColor,
          },
        ]}
      />
    </View>
  );
};

PartialRing.defaultProps = {
  outerRadius: 200,
  innerRadius: 150,
  color: 'cyan',
  innerColor: 'white',
  openColor: 'orange',
  openDegree: 0,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  halfCircleContainer: {
    overflow: 'hidden',
  },
  lowerCircleContainer: {
    flexDirection: 'column-reverse',
  },
  lowerCircle: {
    overflow: 'hidden',
  },
  upperCircle: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  innerCircle: {
    position: 'absolute',
  },
});

export default PartialRing;
