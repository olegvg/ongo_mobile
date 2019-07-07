/**
 * Menu Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

import { Linking, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Actions
import * as UserActions from '../../../redux/user/actions';

// The component we're mapping to
import MenuRender from './MenuView';

// Authenticated User Menu
const authMenu = [
  { title: 'Обновить профиль', onPress: () => { Actions.updateProfile(); } },
  { title: 'Изменить пароль', onPress: () => { Actions.passwordReset(); } },
  { title: 'Добавить точку', onPress: () => Linking.openURL('https://ru.surveymonkey.com/r/J6NKWYQ') },
  { title: 'Вывести средства',
    onPress: () => Alert.alert(
    'Вывод средств',
    'Вывод средств возможен с суммы 5 000 руб. Вы сможете вывести заработанные средства на банковскую карту, Я.Деньги, QIWI wallet.',
  ) },
];

// Unauthenticated User Menu
const unauthMenu = [
  { title: 'Войти', onPress: () => { Actions.login(); } },
  { title: 'Зарегистрироваться', onPress: () => { Actions.signUp(); } },
];

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  unauthMenu,
  authMenu,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  logout: UserActions.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuRender);
