/**
 * Forgot Password Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import FormRender from './FormView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  formType: 'passwordReset',
  formFields: ['Email'],
  buttonTitle: 'Отправить',
  successMessage: 'Мы отправили инструкции по сбросу пароля на ваш email',
  introText: 'Введите email вашего аккаунта и мы вышлем вам инструкции по восстановлению пароля',
});

// Any actions to map to the component?
const mapDispatchToProps = {
  submit: UserActions.resetPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormRender);
