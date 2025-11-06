import React from "react";
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import { globalStyles } from "../styles/global";

export default function LoginScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Iniciar sesión</Text>
            <TextInput style={globalStyles.input} placeholder="Correo electrónico" />
            <TextInput style={globalStyles.input} placeholder="Contraseña"  secureTextEntry />
            <TouchableOpacity style={globalStyles.button}>
                <Text style={globalStyles.button}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
};

