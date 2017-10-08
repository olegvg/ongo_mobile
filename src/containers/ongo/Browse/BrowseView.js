/**
 * Ongo Tabs Screen
 *
 */

import { v1 } from 'uuid';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Linking,
  View,
  Alert,
  ListView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SocialIcon } from 'react-native-elements';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { Actions } from 'react-native-router-flux';

import MapView from 'react-native-map-clustering';
import Marker from 'react-native-maps';

// Consts and Libs
import { AppColors, AppStyles } from '../../../theme/';

// Components
import {
  Alerts,
  Button,
  Card,
  Spacer,
  Text,
  List,
  ListItem,
  SwitchesList,
  FormInput,
  FormLabel,
  ClusteredMap
} from '../../../components/ui/';

// import { ListItem } from 'react-native-elements';


/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary,
  },
  tabbarIndicator: {
    backgroundColor: '#FFF',
  },
  tabbar_text: {
    color: '#FFF',
  },

  text: {
    color: AppColors.brand.secondary,
    textAlign: 'center',
  },

  container: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

/* Component ==================================================================== */
class OngoTabs extends Component {
  static componentName = 'OngoTabs';

  static propTypes = {
    points: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    categories: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    currUser: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    changePoint: PropTypes.func,
    updateCategoryFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: {},
    categories: {},
    currUser: {},
    changePoint: null,
    updateCategoryFilter: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      categoryFilter: {},
      pointsState: {},
      position: {
        latitude: 55.7552062, // default to center of Moscow
        longitude: 37.6203287,
        error: null,
      },
      navigation: {
        index: 0,
        routes: [
          { key: '1', title: 'Карта' },
          { key: '2', title: 'Категории' },
          { key: '3', title: 'Заказы' },
        ],
      },
    };
    this.updateFilter(props);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          },
        });
      },
      error => this.setState({
        position: {
          error: error.message,
          latitude: 55.7552062,   // default to center of Moscow
          longitude: 37.6203287,
        },
      }),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000, distanceFilter: 10 },
    );
  };

  componentWillReceiveProps(nextProps) { this.updateFilter(nextProps); };

  updateFilter = (props) => {
    this.state.categoryFilter = { ...props.categories };
    const catFilter = props.currUser.invertedCatFilter;
    Object.keys(props.categories).map((k) => {
      this.state.categoryFilter[k].selState = !(catFilter && catFilter[k] === false);
    });

    if (!!props.points) {
      const catKeys = Object.keys(props.categories);
      Object.keys(props.points).map((k) => {
        const resvdKeys = props.points[k].resvdCtoU ? Object.keys(props.points[k].resvdCtoU) : [];
        const intersect = catKeys.filter(n => resvdKeys.includes(n));
        switch (true) {
          case (intersect.length === 0): {
            this.state.pointsState[k] = 'free';
            break;
          }
          case (intersect.length > 0 && intersect.length < catKeys.length): {
            this.state.pointsState[k] = 'semi';
            break;
          }
          case (intersect.length === catKeys.length): {
            this.state.pointsState[k] = 'busy';
            break;
          }
          default:
            this.state.pointsState[k] = 'error';
        }
      });
    }
  };

  // Chain of closures need to mitigate kinda this bug https://github.com/airbnb/react-native-maps/issues/758
  handleCalloutPress = k => e => {
    this.props.changePoint(k);
    Actions.categoriesModal();
  };

  /**
    * On Change Tab
    */
  handleChangeTab = (index) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  animateClusterPress = (coordinate) => {
    const newRegion = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: this.mapView.state.region.latitudeDelta -
        (this.mapView.state.region.latitudeDelta / 2),
      longitudeDelta: this.mapView.state.region.longitudeDelta -
        (this.mapView.state.region.longitudeDelta / 2),
    };
    /* eslint no-underscore-dangle: 0 */
    this.mapView._root.animateToRegion(newRegion, 1000);
  };

  /**
    * Which component to show
    */
  renderScene = ({ route }) => {
    switch (route.key) {
      case '1' :
        return (
          <View style={styles.container}>
            <ClusteredMap geoData={this.props.points} />
          </View>
        );
      case '2' :
        return (
          <View style={styles.tabContainer}>
            <ScrollView
              automaticallyAdjustContentInsets={false}
              style={[AppStyles.container]}
            >
              <View style={[AppStyles.paddingHorizontal]}>
                <Spacer size={15} />
                <Text h2>Фильтр категорий</Text>
                <Spacer size={-10} />
              </View>
              <SwitchesList
                switches={this.state.categoryFilter}
                default_state
                onSwitch={state => this.props.updateCategoryFilter(state.selIndex, state.selState)}
              />
            </ScrollView>
          </View>
        );
      case '3' :
        return (
          <View style={styles.tabContainer}>
            <ScrollView
              automaticallyAdjustContentInsets={false}
              style={[AppStyles.container]}
            >
              <View style={[AppStyles.paddingHorizontal]}>
                <Spacer size={15} />
                <Text h2 style={styles.text}>
                  Совсем скоро тут появятся заказы от выбранных вами точек
                </Text>
                <SocialIcon
                  title="Мы в Facebook"
                  button
                  raised
                  type="facebook"
                  onPress={() => Linking.openURL('https://www.facebook.com/ongosales/')}
                />
              </View>
            </ScrollView>
          </View>
        );
      default :
        return (
          <View />
        );
    }
  };

  /**
    * Header Component
    */
  renderHeader = props => (
    <TabBar
      {...props}
      style={styles.tabbar}
      indicatorStyle={styles.tabbarIndicator}
      renderLabel={scene => (
        <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
      )}
    />
  );

  render = () => (
    <TabViewAnimated
      style={[styles.tabContainer]}
      renderScene={this.renderScene}
      renderHeader={this.renderHeader}
      navigationState={this.state.navigation}
      onRequestChangeTab={this.handleChangeTab}
    />
  )
}

/* Export Component ==================================================================== */
export default OngoTabs;

/*
 *             <MapView
              /* eslint no-return-assign: 0 */ /*
              ref={ref => this.mapView = ref}
              style={styles.map}
              showsUserLocation
              clusterColor={AppColors.pinColors.free}
              clusterTextColor="#fff"
              clusterBorderColor="#fff"
              onClusterPress={coordinate => this.animateClusterPress(coordinate)}
              region={{
                latitude: this.state.position.latitude,
                longitude: this.state.position.longitude,
                latitudeDelta: 0.15,
                longitudeDelta: 0.121,
              }}
            >
              {Object.keys(this.props.points).map(k => (
                <Marker
                  key={v1()}
                  coordinate={this.props.points[k].coords}
                  title={this.props.points[k].name}
                  description={this.state.pointsState[k] === 'busy' ? 'Все категории заняты' : 'Нажмите для выбора категорий'}
                  pinColor={AppColors.pinColors[this.state.pointsState[k]]}
                  onCalloutPress={this.handleCalloutPress(k)}
                />
              ))}
            </MapView>
 */
