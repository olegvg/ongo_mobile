/**
 * SwitchesList
 *
 */

import { v1 } from 'uuid';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet } from 'react-native';

// Consts and Libs

// Components
import { List, ListItem } from './';


/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  background: {
    backgroundColor: '#E9EBEE',
  },
});
/* Component ==================================================================== */
class CustomSwitchesList extends Component {
  static propTypes = {
    switches: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    default_state: PropTypes.bool,
    onSwitch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    switches: {},
    default_state: false,
    onSwitch: null,
  };

  render = () => (
    <List>
      {Object.keys(this.props.switches).map(k => (
        <ListItem
          containerStyle={styles.background}
          key={v1()}
          title={this.props.switches[k].selName}
          hideChevron
          switchButton
          switched={this.props.switches[k].selState === undefined ?
            this.props.default_state : this.props.switches[k].selState}
          onSwitch={(val) => {
            if (this.props.onSwitch) {
              const upd = async () => this.props.onSwitch({
                selIndex: k,
                selState: val,
              });
              upd().then(() => { this.forceUpdate(); });
            }
          }}
        />
        ))}
    </List>
  )
}

/* Export Component ==================================================================== */
export default CustomSwitchesList;
