/**
 * Ongo Scenes
 *
 */
import React from 'react';
import { Scene } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { AppSizes } from '@theme/';

// Components
import { TabIcon } from '@ui/';
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

// Scenes
import Ongo from '@containers/ongo/Browse/BrowseContainer';
import CategoriesFilter from '@containers/ongo/Categories/CategoriesFilterContainer';

const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => <NavbarMenuButton />,
  sceneStyle: {
    ...AppConfig.navbarProps.sceneStyle,
    paddingBottom: AppSizes.tabbarHeight,
  },
};

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'ongoNavBar'} pressOpacity={0.95}>
    <Scene
      {...navbarPropsTabs}
      key={'ongoTabView'}
      component={Ongo}
      title={'ONGO'}
      analyticsDesc={'ONGO'}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'categoriesModal'}
      title={'Категории'}
      clone
      component={CategoriesFilter}
      analyticsDesc={'Categories Filter'}
    />
</Scene>
);


export default scenes;
