/**
 * Authenticate Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, signup...
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Spacer, Text, Button } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  background: {
    backgroundColor: AppColors.brand.primary,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
  },
  logo: {
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
    resizeMode: 'cover',
  },
  whiteText: {
    color: '#FFF',
  },
});

/* Component ==================================================================== */
class Authenticate extends Component {
  static componentName = 'Authenticate';

  render = () => (
    <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
      <Image
        source={require('../../images/ongo_logo.png')}
        style={[styles.logo]}
      >

        <Spacer size={AppSizes.screen.height * 0.8} />
      <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
        <View style={[AppStyles.flex1]}>
          <Button
            title={'ВХОД'}
            onPress={Actions.login}
            fontSize={20}
            backgroundColor={AppColors.brand.button}
          />
        </View>
      </View>

      <Spacer size={10} />

      <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
        <View style={[AppStyles.flex1]}>
          <Button
            title={'РЕГИСТРАЦИЯ'}
            onPress={Actions.signUp}
            backgroundColor={AppColors.brand.button}
            fontSize={20}
          />
        </View>
      </View>
      </Image>

    </View>
  )
}

/* Export Component ==================================================================== */
export default Authenticate;
