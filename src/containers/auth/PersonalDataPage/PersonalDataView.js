import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Spacer, Text, Button } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  background: {
    backgroundColor: AppColors.background,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
  },
  logo: {
    width: AppSizes.screen.width * 0.85,
    resizeMode: 'contain',
  },
  textStyle: {
    color: AppColors.textPrimary,
    padding: 10,
  },
});

/* Component ==================================================================== */
class PersonalData extends Component {
  static componentName = 'PersonalData';

  static propTypes = {
    pdText: PropTypes.string,
  };

  static defaultProps = {
    pdText: '',
  };
  render = () => (
    <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
      <ScrollView>
        <Text style={[AppStyles.textLeftAligned, styles.textStyle]}>
          {this.props.pdText}
        </Text>
      </ScrollView>
    </View>
  )
}

/* Export Component ==================================================================== */
export default PersonalData;
