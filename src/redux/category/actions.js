/**
 * Category Management Actions
 *
 */

import { AsyncStorage } from 'react-native';
import { ErrorMessages, Firebase, FirebaseRef } from '../../constants/';

// Инициализация см. двумя путями:
// в containers/Launch/LaunchContainer.js когда email и password уже известны и
// в containers/auth/Forms/LoginContainer.js при вводе пользователем email и password в логин-форме
// Всё это для предотвращения неавторизованного доступа к данным до логина в FireBase
export function getCategories() {
  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  return async (dispatch) => {
    const localLastChanged = await AsyncStorage.getItem('api/categories/last-changed');
    const fbLastChanged = await FirebaseRef.child('master-categories/last-changed').once('value').then(snapshot => snapshot.val());

    // TODO Сделать нормальную реализацию кеширования через локальный AsyncStorage
    if (fbLastChanged && fbLastChanged !== localLastChanged) {
      FirebaseRef.child('master-categories/cat').on('value', snapshot => dispatch({
        type: 'CATEGORY_INIT',
        data: snapshot.val(),
      }));
    }
  // Firebase.database.ServerValue.TIMESTAMP
  };
}
