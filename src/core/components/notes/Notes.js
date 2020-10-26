import React from 'react';
import {Text, View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {
  withAlertService,
  withFirebase,
} from '../../../shared/components/HOCForInjection/WithService';
import SingleNote from './SingleNote';
import {mainThemeColor} from '../../../configuration/colors';

function Notes({sessionData, firebaseService, alertService, docRef, refresh}) {
  const renderItem = ({item, index}) => {
    return (
      <SingleNote nota={item} index={index} docRef={docRef} refresh={refresh} />
    );
  };

  const newNoteButton = () => {
    return (
      <View style={[styles.buttonsContainer]}>
        <TouchableOpacity onPress={onNewNotePress} style={styles.button}>
          <Text>+ Agregar nota</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onNewNotePress = () => {
    alertService.showPromptDialog('Nota').then(name => {
      firebaseService.addObjToArray(docRef, 'notes', name).then(refresh);
    });
  };

  return (
    <>
      <View style={styles.containerStyle}>
        {sessionData && sessionData.notes && sessionData.notes.length > 0 ? (
          <>
            {newNoteButton()}
            <FlatList
              data={sessionData.notes}
              keyExtractor={item => item}
              renderItem={renderItem}
            />
          </>
        ) : (
          <>
            <View style={styles.centeredTextStyle}>
              <Text>Esta sesión todavía no tiene notas</Text>
            </View>
            {newNoteButton()}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    padding: 10,
  },
  containerStyle: {},
  button: {
    backgroundColor: 'rgba(0,0,0,0)',
    alignSelf: 'center',
    borderColor: mainThemeColor(1),
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },

  resetButton: {
    backgroundColor: mainThemeColor(1),
    marginLeft: 14,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
    zIndex: 9,
    elevation: 10,
  },
  centeredTextStyle: {
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withAlertService(withFirebase(Notes));
