/**
 * Point Reducer
 *
 */

// Set initial state
const initialState = {};

export default function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case 'CATEGORY_INIT': {
      return { ...action.data };
    }
    default:
      return state;
  }
}
