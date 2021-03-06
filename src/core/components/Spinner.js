import React from 'react';
import {StyleSheet, View, Dimensions, ActivityIndicator} from 'react-native';
import {mainThemeColor} from '../../configuration';

export function OurSpinner({show}) {
  return show ? (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={70} color={mainThemeColor(1)} />
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  spinnerContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
