import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Login from './src/components/Login';
import Reg from './src/components/Reg';
import Note from './src/components/Note';
import AuthCheck from './src/components/AuthCheck';
import NoteDetails from './src/components/NoteDetails';
import TodoDetails from './src/components/TodoDetails';
import customDrawer from './src/components/customDrawer';
import Todo from './src/components/Todo';
console.disableYellowBox = true;

const AuthStack = createStackNavigator({ Login: Login, Reg: Reg });
const AppStack = createDrawerNavigator({
  'Ghi chú': Note, 'Việc cần làm': Todo
},{
  drawerType: 'slide',
  contentComponent: customDrawer
});

const AppModalStack = createStackNavigator(
  {
    App: AppStack,
    NoteDetails: {
      screen: NoteDetails
    },
    TodoDetails: {
      screen: TodoDetails
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthCheck: AuthCheck,
      App: AppModalStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthCheck',
    }
  )
);