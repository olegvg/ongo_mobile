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
import MapClusterMarker from './ClusterMarker';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 55.7552062; // your starting lat
const LONGITUDE = 37.6203287; // your starting lng
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

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
  };

  static defaultProps = {
    geoData: {},
  };

  static createCluster(geoData) {
    const cluster = supercluster({
      radius: 75,
      maxZoom: 16,
    });

    const places = Object.keys(geoData).map(k => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [geoData[k].coords.longitude, geoData[k].coords.latitude]},
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

    // this.createCluster = this.createCluster.bind(this);
    // this.getMarkers = this.getMarkers.bind(this);
    // this.getZoomLevel = this.getZoomLevel.bind(this);
    // this.onRegionChange = this.onRegionChange.bind(this);

    const cluster = ClusteredMap.createCluster(this.props.geoData);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      cluster,
      markers: null,
    };
    this.state.markers = this.getMarkers(cluster, this.state.region);

  }

  componentWillReceiveProps(nextProps) {
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
    return this.state.markers.map((marker, i) => (
      <MapView.Marker
        key={i}
        coordinate={{
          latitude: marker.geometry.coordinates[1],
          longitude: marker.geometry.coordinates[0],
        }}
      >
        <MapClusterMarker {...marker} />
      </MapView.Marker>
      ));
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
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
