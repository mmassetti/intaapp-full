import React, {useState, useEffect} from 'react';
import {mainThemeColor} from '../../../configuration';

import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  withFirebase,
  withSessionsService,
  Separator,
  BottomRightButton,
} from '../../../shared';
import SearchInput, {createFilter} from 'react-native-search-filter';
import SessionItem from './SessionItem';
import {Icon} from 'native-base';

function SessionsList(props) {
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    props.firebaseService.getAllSessions().then(sessions => {
      setSessions(sessions.sort(props.sessionsService.compareSessionsByDate));
    });
  }, [refresh]);
  const filteredSession = sessions.filter(
    createFilter(searchTerm, ['user', 'description']),
  );

  function refreshSessions() {
    setRefresh(true);
  }

  function goToNewSession() {
    props.navigation.navigate('NewSession', {
      onGoBack: () => refreshSessions(),
    });
  }

  function goToSessionDetails(item) {
    props.navigation.navigate('SessionDetails', {
      item: item.data(),
      itemId: item.id,
      onGoBack: () => refreshSessions(),
    });
  }

  const renderItem = ({item, index}) => {
    return (
      <SessionItem
        item={item}
        index={index}
        onItemPressed={() => goToSessionDetails(item)}
      />
    );
  };

  return (
    <>
      <SearchInput
        onChangeText={setSearchTerm}
        style={styles.searchInput}
        placeholder="Buscar por nombre, descripcion, mes ..."
      />

      <FlatList
        data={filteredSession}
        key={({item: {id}}) => id}
        renderItem={renderItem}
      />

      <BottomRightButton
        name="plus"
        type="Entypo"
        onPress={() => goToNewSession()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  adjustButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: mainThemeColor(1),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  icon: {
    color: 'white',
  },
});

export default withSessionsService(withFirebase(SessionsList));