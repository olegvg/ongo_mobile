/**
 * Point Management Actions
 *
 */

import { AsyncStorage } from 'react-native';
import { ErrorMessages, Firebase, FirebaseRef } from '../../constants/';


// Инициализация см. двумя путями:
// в containers/Launch/LaunchContainer.js когда email и password уже известны и
// в containers/auth/Forms/LoginContainer.js при вводе пользователем email и password в логин-форме
// Всё это для предотвращения неавторизованного доступа к данным до логина в FireBase
export function getPoints() {
  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  return async (dispatch) => {
    const localLastChanged = await AsyncStorage.getItem('api/points/last-changed');
    const fbLastChanged = await FirebaseRef.child('points/last-changed').once('value').then(snapshot => snapshot.val());

    // TODO Сделать нормальную реализацию кеширования через локальный AsyncStorage
    if (fbLastChanged && fbLastChanged !== localLastChanged) {
      FirebaseRef.child('points/pts').on('value', (snapshot) => {
        const val = snapshot.val();
        Object.keys(val).map(k =>
          val[k].coords = {
            latitude: parseFloat(val[k].coords[0]),
            longitude: parseFloat(val[k].coords[1]),
          },
        );
        // const val = snapshot.val();
        dispatch({
          type: 'POINT_INIT',
          data: val,
        });
      });
    }
  // Firebase.database.ServerValue.TIMESTAMP
  };
}

export function updatePointWithUser(stateObj) {
  console.log(stateObj);

  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  const ref = FirebaseRef.child(`points/pts/${stateObj.pid}/resvdCtoU`);
  if (stateObj.selState === true) {
    ref.child(stateObj.selIndex).set(UID);
  } else {
    ref.child(stateObj.selIndex).remove();
  }
  return async () => {};
}

export function setCurrPoint(point) {
  return async (dispatch) => {
    dispatch({
      type: 'POINT_CHANGE',
      data: point,
    });
  };
}
