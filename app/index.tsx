import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // Добавляем NavigationContainer
import appJson from '../app.json';
import AppNavigator from '../src/navigation/AppNavigator';

const appName = appJson.expo.name;

const App = () => <AppNavigator />;

export default App;

AppRegistry.registerComponent(appName, () => App);
