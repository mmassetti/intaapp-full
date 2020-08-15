//@ts-check
import React, {useState, useEffect} from 'react';

import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'native-base';
import {withFirebase} from '../../../shared';

function SessionDetails(props) {
  useEffect(() => {}, []);

  function goBackToSessions() {
    //TODO: si la accion fue Volver no deberia mandar el onGoBack para evitar que entre al use effect innecesariamente en sessions list
    const {navigation} = props;
    navigation.goBack();
    navigation.state.params.onGoBack();
  }

  const showButtons = () => {
    return (
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} light onPress={() => goBackToSessions()}>
          <Text style={styles.buttonText}>Volver</Text>
        </Button>
      </View>
    );
  };

  return <View style={styles.viewContainer}>{showButtons()}</View>;
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-evenly',
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default withFirebase(SessionDetails);
