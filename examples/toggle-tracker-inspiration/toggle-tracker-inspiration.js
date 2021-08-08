import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import TrackerRing from './components/tracker-ring';

const ToggleTrackerInspiration: React.FC<{}> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TrackerRing />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ToggleTrackerInspiration;
