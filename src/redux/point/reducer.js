/**
 * Point Reducer
 *
 */

// Set initial state
const initialState = {
  points: {},
  curPoint: {},
};

export default function pointReducer(state = initialState, action) {
  switch (action.type) {
    case 'POINT_INIT': {
      return { ...state, points: { ...action.data } };
    }
    case 'POINT_CHANGE': {
      if (action.data) {
        return {
          ...state,
          currPoint: action.data,
        };
      }
      return { ...state };
    }
    default:
      return state;
  }
}
