import React from "react";
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import { globalStyles } from "../styles/global";

export default function LoginScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Registrarse</Text>
            <TextInput style={globalStyles.input} placeholder="Correo electrónico" />
            <TextInput style={globalStyles.input} placeholder="Contraseña"  secureTextEntry />
            <TextInput style={globalStyles.input} placeholder="Confirma ontraseña"  secureTextEntry />
            <TouchableOpacity style={globalStyles.button}>
                <Text style={globalStyles.button}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    );
};

