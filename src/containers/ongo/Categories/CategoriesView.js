import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '../../../theme/';

// Components
import { Spacer, Text, Button, SwitchesList } from '../../../components/ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rightAlign: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  redText: {
    backgroundColor: '#FF0000',
  },
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
class CategoriesModal extends Component {
  static componentName = 'CategoriesModal';

  static propTypes = {
    points: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    categories: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    updUserWithPoint: PropTypes.func,
    updPointWithUser: PropTypes.func,
  };

  static defaultProps = {
    points: {},
    user: {},
    categories: {},
    updUserWithPoint: null,
    updPointWithUser: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      categoryFilter: {},
    };
    this.updateAvailCategories(props);
  }

  componentWillReceiveProps = nextProps => this.updateAvailCategories(nextProps);

  updateAvailCategories = (props) => {
    this.state.categoryFilter = { ...props.categories };
    const catFilter = props.user.invertedCatFilter;

    Object.keys(this.state.categoryFilter).map((k) => {
      if (!!catFilter && catFilter[k] === false) {
        delete this.state.categoryFilter[k];
        return null;
      }

      const resvdCtoU = props.points.points[props.points.currPoint].resvdCtoU;

      if (!resvdCtoU || !resvdCtoU[k]) {
        this.state.categoryFilter[k].selState = false;
        return null;
      }

      if (!!resvdCtoU && resvdCtoU[k] === props.user.uid) {
        this.state.categoryFilter[k].selState = true;
      } else {
        delete this.state.categoryFilter[k];
      }
    });
    // this.forceUpdate();
  };

  render = () => (
    <View style={[AppStyles.container, styles.background]}>
      <ScrollView
        automaticallyAdjustContentInsets={false}
        style={[AppStyles.container]}
      >
        <View style={[AppStyles.paddingHorizontal]}>
          <Spacer size={15} />
          <View style={styles.inline}>
            <Text h2>Резерв категорий</Text>
          </View>
          {!!this.props.points.currPoint && (
            <View>
              <Text>для {this.props.points.points[this.props.points.currPoint].name}</Text>
            </View>
          )}
          <Spacer size={-10} />
        </View>
        <SwitchesList
          switches={this.state.categoryFilter}
          onSwitch={(state) => {
            const outState = {
              ...state,
              pid: this.props.points.currPoint,
            };
            Promise.all([
              !!this.props.updPointWithUser && this.props.updPointWithUser(outState),
              !!this.props.updUserWithPoint && this.props.updUserWithPoint(outState),
            ]);
          }}
        />
      </ScrollView>
    </View>
  )
}

/* Export Component ==================================================================== */
export default CategoriesModal;
