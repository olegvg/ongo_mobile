/**
 * ONGO Tabs Container
 *
 */
import { connect } from 'react-redux';

// The component we're mapping to
import MapView from './ClusteredMap';
import MapClusterMarker from './ClusterMarker';

// Actions
import { setCurrPoint } from '../../../redux/point/actions';

// What data from the store shall we send to the component?
const mapStateToPropsMap = state => ({
  geoData: state.point.points,
});

const mapStateToPropsMarker = state => ({
  points: state.point.points,
  categories: state.category,
});

// Any actions to map to the component?
const mapDispatchToPropsMarker = {
  changePoint: setCurrPoint,
};

export default connect(mapStateToPropsMap)(MapView);
export const ClusterMarker = connect(mapStateToPropsMarker, mapDispatchToPropsMarker)(MapClusterMarker);
