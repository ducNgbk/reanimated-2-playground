import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {
  size: number;
  outerRadius: number;
  innerRadius: number;
  color: string;
  innerColor: string;
  openColor: string;
  openDegree: number;
}

const PartialRing: React.FC<Props> = ({
  color,
  innerColor,
  openColor,
  innerRadius,
  outerRadius,
  openDegree,
}) => {
  const {upperRotate, lowerRotate} = useMemo(() => {
    const degree = openDegree % 360;
    if (degree < 180) {
      return {upperRotate: 0, lowerRotate: degree};
    }
    return {upperRotate: degree - 180, lowerRotate: 180};
  }, [openDegree]);

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
          <View
            style={{
              width: outerRadius * 2,
              height: outerRadius,
              backgroundColor: openColor,
              transform: [
                {translateY: -outerRadius / 2},
                {rotate: `${upperRotate}deg`},
                {translateY: outerRadius / 2},
              ],
            }}
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
          <View
            style={{
              width: outerRadius * 2,
              height: outerRadius,
              backgroundColor: openColor,
              transform: [
                {translateY: outerRadius / 2},
                {rotate: `${lowerRotate}deg`},
                {translateY: -outerRadius / 2},
              ],
            }}
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
