/**
 * ClusteredMap
 *
 */

import isEqual from 'lodash.isequal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions } from 'react-native';

import MapView from 'react-native-maps';
import supercluster from 'supercluster';
import { ClusterMarker } from './MapContainer';

// Consts and Libs
import { AppColors } from '../../../theme/index';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

/* Component ==================================================================== */
class ClusteredMap extends Component {

  static propTypes = {
    geoData: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    region: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
    clusterColor: PropTypes.string,
    clusterTextColor: PropTypes.string,
    clusterBorderColor: PropTypes.string,
  };

  static defaultProps = {
    geoData: {},
    region: {},
    clusterColor: AppColors.pinColors.free,
    clusterTextColor: '#fff',
    clusterBorderColor: '#fff',
  };

  static createCluster(geoData) {
    const cluster = supercluster({
      radius: 75,
      maxZoom: 16,
    });

    const places = Object.keys(geoData).map(k => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [geoData[k].coords.longitude, geoData[k].coords.latitude]
      },
      pointKey: k,
    }));

    try {
      cluster.load(places);
      return cluster;
    } catch (e) {
      console.debug('failed to create cluster', e);
      return null;
    }
  }

  constructor(props) {
    super(props);

    const cluster = ClusteredMap.createCluster(this.props.geoData);

    this.state = {
      region: {
        ...props.region,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      cluster,
      markers: null,
      superMapProps: null,
    };
    this.state.markers = this.getMarkers(cluster, this.state.region);
  }

  componentWillReceiveProps(nextProps) {
    this.state.superMapProps = nextProps; // Propagate props to underlying <MapView>

    const cluster = ClusteredMap.createCluster(nextProps.geoData);
    if (cluster) {
      const markers = this.getMarkers(cluster, this.state.region);

      this.setState({
        cluster,
        markers,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.region, this.state.region)) {
      this.setState({
        markers: this.getMarkers(this.state.cluster, this.state.region),
      });
    }
  }

  onRegionChange = (region) => {
    if (this.regionChangeTimer !== null) {
      clearTimeout(this.regionChangeTimer);
    }
    this.regionChangeTimer = setTimeout(() => {
      this.setState({
        region,
      });
      this.regionChangeTimer = null;
    }, 150);
  };

  getZoomLevel(region = this.state.region) {
    // http://stackoverflow.com/a/6055653
    const angle = region.longitudeDelta;

    // 0.95 for finetuning zoomlevel grouping
    return Math.round(Math.log(360 / angle) / Math.LN2);
  }

  getMarkers(cluster, region) {
    const padding = 0;
    return cluster.getClusters([
      region.longitude - (region.longitudeDelta * (0.5 + padding)),
      region.latitude - (region.latitudeDelta * (0.5 + padding)),
      region.longitude + (region.longitudeDelta * (0.5 + padding)),
      region.latitude + (region.latitudeDelta * (0.5 + padding)),
    ], this.getZoomLevel());
  }

  renderMarkers() {
    return this.state.markers.map(marker => (<ClusterMarker {...marker} />));
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          {...this.state.superMapProps} // Propagate <ClusteredMap> props to underlying <MapView>
          /* eslint no-return-assign: 0 */
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default ClusteredMap;
