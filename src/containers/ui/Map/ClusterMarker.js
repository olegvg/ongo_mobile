/**
 * MapClusterMarker
 *
 */

import { v1 } from 'uuid';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import MapView from 'react-native-maps';
import Svg, { Circle, Text } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Consts and Libs
import { AppColors } from '../../../theme/';


/* Component ==================================================================== */
class MapClusterMarker extends Component {

  static propTypes = {
    points: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    categories: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    geometry: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
    pointKey: PropTypes.string,
    properties: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    changePoint: PropTypes.func.isRequired,
  };

  static defaultProps = {
    geometry: {
      coordinates: [],
      type: '',   // Cluster | Point
    },
    pointKey: '',
    properties: {
      cluster: null,
      point_count_abbreviated: null,
    },
  };

  setNativeProps(props) {
    this.marker.setNativeProps(props);
  }

  handleCalloutPress(k) {
    this.props.changePoint(k);
    Actions.categoriesModal();
  };

  render() {
    if (!this.props.properties.cluster) {
      const catKeys = Object.keys(this.props.categories);
      const points = this.props.points;
      const key = this.props.pointKey;
      const resvdKeys = points[key].resvdCtoU ? Object.keys(points[key].resvdCtoU) : [];
      const intersect = catKeys.filter(n => resvdKeys.includes(n));
      let pointBusyness;
      switch (true) {
        case (intersect.length === 0): {
          pointBusyness = 'free';
          break;
        }
        case (intersect.length > 0 && intersect.length < catKeys.length): {
          pointBusyness = 'semi';
          break;
        }
        case (intersect.length === catKeys.length): {
          pointBusyness = 'busy';
          break;
        }
        default:
          pointBusyness = 'error';
      }

      return (
        <MapView.Marker
          key={v1()}
          title={points[key].name}
          description={pointBusyness === 'busy' ? 'Все категории заняты' : 'Нажмите для выбора категорий'}
          coordinate={{
            latitude: this.props.geometry.coordinates[1],
            longitude: this.props.geometry.coordinates[0],
          }}
          onCalloutPress={() => this.handleCalloutPress(key)}
        >
          <Icon
            name="local-grocery-store"
            size={36}
            color={AppColors.pinColors[pointBusyness]}
          />
        </MapView.Marker>
      );
    }

    const pointCount = this.props.properties.point_count_abbreviated;
    const height = 50;
    const width = 50;
    const fontSize = 20;

    return (
      <MapView.Marker
        key={v1()}
        coordinate={{
          latitude: this.props.geometry.coordinates[1],
          longitude: this.props.geometry.coordinates[0],
        }}
      >
        <View ref={(c) => { this.marker = c; }}>
          <Svg
            height={height}
            width={width}
          >
            <Circle
              cx={width / 2}
              cy={height / 2}
              strokeWidth={0}
              r="25"
              fill={AppColors.clusterColors.borderColor}
              fillOpacity={0.5}
            />
            <Circle
              cx={width / 2}
              cy={height / 2}
              strokeWidth={0}
              r="20"
              fill={AppColors.clusterColors.bodyColor}
            />
            <Text
              fill={AppColors.clusterColors.textColor}
              fontSize={fontSize}
              // fontWeight="bold"
              strokeWidth={0}
              x={width / 2}
              y={(height / 2) - (fontSize / 2)}
              dy={fontSize * -0.25}
              textAnchor="middle"
            >
              {pointCount}
            </Text>
          </Svg>
        </View>
      </MapView.Marker>
    );
  }
}

/* Export Component ==================================================================== */
export default MapClusterMarker;

