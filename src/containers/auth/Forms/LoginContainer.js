/**
 * Login Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '../../../redux/user/actions';
import * as CategoryActions from '../../../redux/category/actions';
import * as PointActions from '../../../redux/point/actions';

// The component we're mapping to
import FormRender from './FormView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  formType: 'login',
  formFields: ['Email', 'Password'],
  buttonTitle: 'Войти',
  successMessage: 'Вы вошли в приложение!',
});

// Any actions to map to the component?
const mapDispatchToProps = {
  submit: UserActions.login,
  getCategories: CategoryActions.getCategories,
  getPoints: PointActions.getPoints,

};

export default connect(mapStateToProps, mapDispatchToProps)(FormRender);
