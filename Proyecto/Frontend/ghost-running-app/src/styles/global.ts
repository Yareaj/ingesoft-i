//se definen styles de diferentes elementos para poder reutlizarlos mas adelante
import { StyleSheet } from "react-native";

export const colors = {
    primary: '#4CAF50',
    secondary: '#FFC107',
    background: '#FFFFFF',
    text: '#333333',
    error: '#E53935'
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.secondary,
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})