import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {FlatList, StyleSheet} from 'react-native';
import Page from './components/Page';

const WORDS = ['I', 'Love', 'U'];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SlidePage: React.FC<{}> = () => {
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <AnimatedFlatList
      data={WORDS}
      pagingEnabled
      style={styles.container}
      horizontal
      keyExtractor={(item) => item}
      renderItem={({item, index}) => {
        return <Page key={item} title={item} index={index} scrollX={scrollX} />;
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    />
  );

  // return (
  //   <Animated.ScrollView
  //     pagingEnabled
  //     style={styles.container}
  //     horizontal
  //     onScroll={scrollHandler}
  //     scrollEventThrottle={16}>
  //     {WORDS.map((word, index) => {
  //       return <Page key={word} title={word} index={index} scrollX={scrollX} />;
  //     })}
  //   </Animated.ScrollView>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SlidePage;
