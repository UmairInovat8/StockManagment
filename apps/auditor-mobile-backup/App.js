import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import AuditSession from './src/screens/AuditSession';
import useAuthStore from './src/store/useAuthStore';

const Stack = createStackNavigator();

const App = () => {
    const token = useAuthStore((state) => state.token);

    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }}>
                {token == null ? (
                    <Stack.Screen name="Login" component={Login} />
                ) : (
                    <>
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="AuditSession" component={AuditSession} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
