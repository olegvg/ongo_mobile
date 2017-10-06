import { connect } from 'react-redux';

// Actions

// The component we're mapping to
import CategoriesRender from './CategoriesView';
import { updatePointWithUser } from '../../../redux/point/actions';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  points: state.point,
  user: state.user,
  categories: state.category,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updPointWithUser: updatePointWithUser,
};

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesRender);
