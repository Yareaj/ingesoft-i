//sobre esta pantalla se desplegaran LoginScreen y RegisterScreen
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen'

//creamos un elementos llamado Stack para apilar nuestras ventanas de Auth
const Stack = createNativeStackNavigator();

//Creamos nuestro propio elemento de React AuthNavigator
//Este elemento se encarga de devolvernos un Stack de react con nuestras dos screens: login y register
const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Login'}}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Register'}}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;