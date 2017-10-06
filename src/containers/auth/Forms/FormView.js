/**
 * Login/Sign Up/Forgot Password Screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
import TcombTextInput from '@components/tcomb/TextInput';
import TcombBoolean from '@components/tcomb/Checkbox';

/* Component ==================================================================== */
let redirectTimeout;
class AuthForm extends Component {
  static componentName = 'Login';

  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    submit: PropTypes.func,
    getCategories: PropTypes.func,
    getPoints: PropTypes.func,
    onSuccessfulSubmit: PropTypes.func,
    formType: PropTypes.oneOf(['login', 'signUp', 'passwordReset', 'updateProfile']),
    formFields: PropTypes.arrayOf(PropTypes.string),
    buttonTitle: PropTypes.string,
    successMessage: PropTypes.string,
    introTitle: PropTypes.string,
    introText: PropTypes.string,
  }

  static defaultProps = {
    user: null,
    submit: null,
    getCategories: null,
    getPoints: null,
    onSuccessfulSubmit: null,
    formType: 'login',
    formFields: ['Email', 'Password'],
    buttonTitle: 'Войти',
    successMessage: 'Awesome, you\'re now logged in',
    introTitle: null,
    introText: null,
  }

  constructor(props) {
    super(props);

    // What fields should exist in the form?
    const formFields = {};
    if (props.formFields.indexOf('Email') > -1) formFields.Email = this.validEmail;
    if (props.formFields.indexOf('Phone') > -1) formFields.Phone = this.validPhone;
    if (props.formFields.indexOf('Password') > -1) formFields.Password = this.validPassword;
    if (props.formFields.indexOf('ConfirmPassword') > -1) formFields.ConfirmPassword = this.validPassword;
    if (props.formFields.indexOf('FirstName') > -1) formFields.FirstName = FormValidation.String;
    if (props.formFields.indexOf('LastName') > -1) formFields.LastName = FormValidation.String;
    if (props.formFields.indexOf('PersonalDataAgreement') > -1) formFields.PersData = this.validPDAgreement;

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      form_fields: FormValidation.struct(formFields),
      form_values: {
        Email: (props.user && props.user.email) ? props.user.email : '',
        FirstName: (props.user && props.user.firstName) ? props.user.firstName : '',
        LastName: (props.user && props.user.lastName) ? props.user.lastName : '',
      },
      options: {
        fields: {
          Email: {
            template: TcombTextInput,
            label: 'Емейл',
            error: 'Введите правильный емейл',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Phone: {
            template: TcombTextInput,
            label: 'Телефон',
            error: 'Введите правильный телефон',
            placeholder: '+71234567890',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Password: {
            template: TcombTextInput,
            label: 'Пароль',
            error: 'Пароль должен быть 8 или более символов, состоять из букв и цифр',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
          },
          ConfirmPassword: {
            template: TcombTextInput,
            label: 'Подтвердите пароль',
            error: 'Пароли должны совпадать',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
          },
          FirstName: {
            template: TcombTextInput,
            label: 'Имя',
            error: 'Введите своё имя',
            clearButtonMode: 'while-editing',
          },
          LastName: {
            template: TcombTextInput,
            label: 'Фамилия',
            error: 'Введите свою фамилию',
            clearButtonMode: 'while-editing',
          },
          PersData: {
            template: TcombBoolean,
            config: {
              scene: 'agreePersonalData',
              // label1: 'Согласен с условиями',
              // label2: 'услуги',
            },
            error: 'Согласитесь с условиями',
            label: 'Согласен с _ условиями _ сервиса',
          },
        },
      },
    };
  }

  componentDidMount = async () => {
    // Pre-populate any details stored in AsyncStorage
    const values = await this.getStoredCredentials();

    if (values !== null && values.email && values.password) {
      this.setState({
        form_values: {
          ...this.state.form_values,
          Email: values.email || '',
          Password: values.password || '',
        },
      });
    }
  }

  componentWillUnmount = () => clearTimeout(redirectTimeout);

  /**
    * Get user data from AsyncStorage to populate fields
    */
  getStoredCredentials = async () => {
    const values = await AsyncStorage.getItem('api/credentials');
    return JSON.parse(values);
  };

  /**
    * Email Validation
    */
  validEmail = FormValidation.refinement(
    FormValidation.String, (email) => {
      const regularExpression = /^.+@.+\..+$/i;

      return regularExpression.test(email);
    },
  );

  validPhone = FormValidation.refinement(
    FormValidation.String, (phone) => {
      const regularExpression = /^\+\d{11}$/i;

      return regularExpression.test(phone);
    },
  );

  validPDAgreement = FormValidation.refinement(
    FormValidation.Boolean, value => value,
  );

  /**
    * Password Validation - Must be 6 chars long
    */
  validPassword = FormValidation.refinement(
    FormValidation.String, (password) => {
      if (password.length < 8) return false; // Too short
      if (password.search(/\d/) === -1) return false; // No numbers
      if (password.search(/[a-zA-Z]/) === -1) return false; // No letters
      return true;
    },
  );

  /**
    * Password Confirmation - password fields must match
    * - Sets the error and returns bool of whether to process form or not
    */
  passwordsMatch = (form) => {
    const error = form.Password !== form.ConfirmPassword;

    this.setState({
      options: FormValidation.update(this.state.options, {
        fields: {
          ConfirmPassword: {
            hasError: { $set: error },
            error: { $set: error ? 'Пароли не совпадают' : '' },
          },
        },
      }),
      form_values: form,
    });

    return error;
  }

  /**
    * Handle Form Submit
    */
  handleSubmit = () => {
    // Get new credentials and update
    const formData = this.form.getValue();

    // Check whether passwords match
    if (formData && formData.Password && formData.ConfirmPassword) {
      const passwordsDontMatch = this.passwordsMatch(formData);
      if (passwordsDontMatch) return false;
    }

    if (formData && formData.PersData === false) {
      return false;
    }

    // Form is valid
    if (formData) {
      this.setState({ form_values: formData }, () => {
        this.setState({ resultMsg: { status: 'Один момент...' } });

        // Scroll to top, to show message
        if (this.scrollView) this.scrollView.scrollTo({ y: 0 });

        if (this.props.submit) {
          this.props.submit(formData).then(() => {
            if (this.props.getCategories) this.props.getCategories();
            if (this.props.getPoints) this.props.getPoints();
            this.setState({
              resultMsg: { success: this.props.successMessage },
            }, () => {
              // If there's another function to fire on successful submit
              // eg. once signed up, let's log them in - pass the Login function
              // through as the onSuccessfulSubmit prop
              if (this.props.onSuccessfulSubmit) {
                return this.props.onSuccessfulSubmit(formData, true)
                  .then(() => {
                    Actions.app({ type: 'reset' });
                    Actions.pop();
                  }).catch(err => this.setState({ resultMsg: { error: err.message } }));
              }

              // Timeout to ensure success message is seen/read by user
              redirectTimeout = setTimeout(() => {
                Actions.app({ type: 'reset' });
                Actions.pop();
              }, 500);

              return true;
            });
          }).catch(err => this.setState({ resultMsg: { error: err.message } }));
        } else {
          this.setState({ resultMsg: { error: 'Нет функции-обработчика входа!' } });
        }
      });
    }

    return true;
  }

  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        ref={(a) => { this.scrollView = a; }}
        style={[AppStyles.container]}
        // contentContainerStyle={[AppStyles.container]}
      >
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.state.resultMsg.success}
            error={this.state.resultMsg.error}
          />

          {(!!this.props.introTitle || !!this.props.introText) &&
            <View>
              {!!this.props.introTitle &&
                <Text h1>{this.props.introTitle}</Text>
              }
              {!!this.props.introText &&
                <Text>{this.props.introText}</Text>
              }

              <Spacer size={10} />
            </View>
          }

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Spacer size={20} />

          <Button title={this.props.buttonTitle} onPress={this.handleSubmit} />

          <Spacer size={10} />

          {this.props.formType === 'login' &&
            <View>
              <TouchableOpacity onPress={Actions.passwordReset}>
                <Text p style={[AppStyles.textCenterAligned, AppStyles.link]}>
                  Забыли пароль?
                </Text>
              </TouchableOpacity>

              <Spacer size={10} />

              <Text p style={[AppStyles.textCenterAligned]}>
                - или -
              </Text>

              <Button outlined title={'Зарегистрироваться'} onPress={Actions.signUp} />
            </View>
          }
        </Card>

        <Spacer size={60} />
      </ScrollView>
    );
  }
}

/* Export Component ==================================================================== */
export default AuthForm;
