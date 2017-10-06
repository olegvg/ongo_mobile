/**
 * ONGO Tabs Container
 *
 */
import { connect } from 'react-redux';

// Actions
import { setCurrPoint } from '../../../redux/point/actions';
import { updateCategoryFilter } from '../../../redux/user/actions';

// The component we're mapping to
import OngoTabsRender from './BrowseView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  points: state.point.points,
  currUser: state.user,
  categories: state.category,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  changePoint: setCurrPoint,
  updateCategoryFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(OngoTabsRender);
