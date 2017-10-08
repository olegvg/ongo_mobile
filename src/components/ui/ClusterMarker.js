/**
 * MapClusterMarker
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Text } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

/* Component ==================================================================== */
class MapClusterMarker extends Component {

  static propTypes = {
    properties: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    circleColour: PropTypes.string,
    textColour: PropTypes.string,
  };

  static defaultProps = {
    properties: {
      cluster: null,
      point_count_abbreviated: null,
    },
    circleColour: '#333', // #2b87a2
    textColour: 'white',
  };

  setNativeProps(props) {
    this.marker.setNativeProps(props);
  }

  render() {
    const { circleColour, textColour } = this.props;

    if (!this.props.properties.cluster) {
      return (
        <Icon ref={(c) => { this.marker = c; }} name="place" size={24} color={circleColour} />
      );
    }

    const pointCount = this.props.properties.point_count_abbreviated;
    const height = 50;
    const width = 50;
    const fontSize = 20;

    return (
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
            fill={circleColour}
            fillOpacity={0.5}
          />
          <Circle
            cx={width / 2}
            cy={height / 2}
            strokeWidth={0}
            r="20"
            fill={circleColour}
          />
          <Text
            fill={textColour}
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
    );
  }
}

/* Export Component ==================================================================== */
export default MapClusterMarker;

