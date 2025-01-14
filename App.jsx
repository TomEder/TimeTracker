import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';

import {store, persistor} from './store';

import Home from './Pages/Home/Home';
import AddProject from './Pages/AddProject/AddProject';
import Project from './Pages/Project/Project';
import BillingPeriods from './Pages/BillingPeriods/BillingPeriods';
import EditProjectForm from './Pages/EditProject/EditProjectForm';
import Tasks from './Pages/Tasks/Tasks';

const Stack = createStackNavigator();

const ensureAsyncStorageFolder = async () => {
  if (Platform.OS === 'ios') {
    const path = `${RNFS.DocumentDirectoryPath}/RCTAsyncLocalStorage_V1`;
    try {
      const folderInfo = await RNFS.stat(path).catch(() => null);
      if (!folderInfo) {
        await RNFS.mkdir(path);
        console.log('Created AsyncStorage directory:', path);
      }
    } catch (error) {
      console.error('Error ensuring AsyncStorage directory:', error);
    }
  }
};

export default function App() {
  useEffect(() => {
    ensureAsyncStorageFolder();
  }, []); // Ensure this runs after the app starts

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="AddProject"
                component={AddProject}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Project"
                component={Project}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="BillingPeriods"
                component={BillingPeriods}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EditProjectForm"
                component={EditProjectForm}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Tasks"
                component={Tasks}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
