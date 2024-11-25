import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

//Redux store and persistor
import {store, persistor} from './store';

//screens
import Home from './Pages/Home/Home';
import AddProject from './Pages/AddProject/AddProject';
import Project from './Pages/Project/Project';
import BillingPeriods from './Pages/BillingPeriods/BillingPeriods';
import EditProjectForm from './Pages/EditProject/EditProjectForm';

const Stack = createStackNavigator();

export default function App() {
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
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
