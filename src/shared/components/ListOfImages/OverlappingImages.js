// @ts-nocheck
import React, {useEffect, useRef, useState, useContext} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {
  calculateOffsetToMiddleOfTheScreen,
  useAnimation,
} from '../../services/animations';
import {OurImage} from './EntryImage';
import {NewAfterImage} from './NewAfterImage';
import {BackgroundContext} from '../BackgroundContext';
import {Background} from '../BackgroundFull';
import {
  withImageHandler,
  withAlertService,
} from '../HOCForInjection/WithService';

export function OverlappingEntries({item, deleteImage}) {
  const [opened, setOpened] = useState(false);
  const [zIndexFirstImage, setFirstIndex] = useState(9);
  const [zIndexSecondImage, setSecondIndex] = useState(8);
  const {background, setOnClose, setBackground} = useContext(BackgroundContext);

  useEffect(() => {
    if (background == item.before.id) {
      animate();
    } else {
      resetAnimation();
    }
  }, [background]);
  const [
    translateYFirstImage,
    triggerFristTransition,
    resetFristTransition,
  ] = useAnimation(0, 300);
  const [opacity, triggerOpacity, resetOpacity] = useAnimation(0.4, 150);
  const [
    translateYSecondImage,
    triggerSecondTransition,
    resetSecondTransition,
  ] = useAnimation(0, 300);
  const [scale, triggerScale, resetScale] = useAnimation(1, 300);

  const [translateX, triggerTranslateX, resetX] = useAnimation(0, 300);

  const animate = () => {
    if (!opened) {
      setOpened(true);
      setFirstIndex(99);
      setSecondIndex(98);
      image1.current.measure((ox, oy, width, height, px, py) => {
        triggerFristTransition(
          calculateOffsetToMiddleOfTheScreen(py) - (height + height / 2),
        );
        triggerScale(1.09);
      });
      image2.current.measure((ox, oy, width, height, px, py) => {
        triggerSecondTransition(calculateOffsetToMiddleOfTheScreen(py));
        triggerScale(1.09);
        triggerTranslateX(-10);
        setTimeout(() => triggerOpacity(1), 100);
      });
    }
  };

  const resetAnimation = () => {
    resetX();
    resetScale();
    resetFristTransition(() => setFirstIndex(9));
    resetSecondTransition(() => setSecondIndex(8));
    resetOpacity();
    setOpened(false);
  };
  let image1 = useRef();
  let image2 = useRef();

  const backEntryStyles = {
    right: -8,
    top: -100,
    zIndex: zIndexSecondImage,
    transform: [{translateY: translateYSecondImage}, {translateX}, {scale}],
  };
  return (
    <View
      style={[
        {
          alignSelf: 'center',
          height: Dimensions.get('window').height * 0.16,
          width: '90%',
        },
      ]}>
      <OurImage
        reference={ref => (image1 = ref)}
        text={opened ? 'Antes' : ''}
        style={{
          zIndex: zIndexFirstImage,
          transform: [{translateY: translateYFirstImage}, {scale}],
          elevation: opened ? 5 : 0,
        }}
        image={item.before}
        onPress={() => setBackground(item.before.id)}
        isBefore={true}
        opened={opened}
        deleteImage={deleteImage(item)}
      />
      {item.after ? (
        <OurImage
          reference={ref => (image2 = ref)}
          text={opened ? 'Después' : ''}
          style={[backEntryStyles, {opacity}]}
          image={item.after}
          onPress={() => setBackground(item.before.id)}
          isBefore={false}
          opened={opened}
          deleteImage={deleteImage(item)}
        />
      ) : (
        <NewAfterImage
          reference={ref => (image2 = ref)}
          style={[styles.container, backEntryStyles, {top: -70}]}
          beforeId={item.before.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 4,
    alignSelf: 'center',
    maxWidth: Dimensions.get('window').width,
  },
});
