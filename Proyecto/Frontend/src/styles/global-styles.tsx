import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000'
	},
	scrollContent: {
		flexGrow: 1
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 30,
		paddingVertical: 40
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 40,
		textAlign: 'center'
	},
	form: {
		width: '100%'
	},
	input: {
		backgroundColor: '#1A1A1A',
		borderWidth: 1,
		borderColor: '#FF8C00',
		borderRadius: 10,
		paddingVertical: 15,
		paddingHorizontal: 20,
		marginBottom: 15,
		color: '#FFFFFF',
		fontSize: 16
	},
	signupButton: {
		backgroundColor: '#FF8C00',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10
	},
	signupButtonText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '600'
	},
	backButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: '#FF8C00',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 15
	},
	backButtonText: {
		color: '#FF8C00',
		fontSize: 18,
		fontWeight: '600'
	}
});

export default styles;