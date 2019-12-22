import React from "react";
import { View, StyleSheet, Button, Text, TextInput, ActivityIndicator } from "react-native";

const APPLICATION_URL = "https://checklistapppoc.azurewebsites.net/api/";

export interface LoginState {
	userName: string;
	password: string;
	isLoading: boolean;
	accessToken: string;
}

export interface LoginProps {
	getMessageFromLogin: (message: string) => void,
}

export default class Login extends React.Component<LoginProps, LoginState> {

	constructor(props: LoginProps) {
        super(props);
        this.state = {
			userName: undefined,
			password: undefined,
			isLoading: false,
			accessToken: undefined
		};
    }
	
	async componentDidMount() {

	}

	private callAPI = async () => {
		this.setState({ isLoading: true });
		const success = await this.login();

		const message = success ? await this.getUsers() : "Login failed!";

		this.setState({ isLoading: false });
		this.props.getMessageFromLogin(message);
	}

	private userNameChange = (userName: string) => {
		this.setState({ userName });
	}

	private passwordChange = (password: string) => {
		this.setState({ password });
	}
	
	private login = async (): Promise<boolean> => {
		try {
			const url = APPLICATION_URL + "TokenAuth/Authenticate";
			const body =  JSON.stringify({
				userNameOrEmailAddress: this.state.userName,
				password: this.state.password,
			  });
			const postParams = {
				method: "POST",
				headers: {
				  Accept: "application/json",
				  "Content-Type": "application/json;charset=UTF-8",
				},
				body: body,
			  };
			let response = await fetch(url, postParams);
			let responseJson = await response.json();
			
			console.log(responseJson)
			
			if (responseJson.success) {
				this.setState({ accessToken: responseJson.result.accessToken });
				return true;
			}
			return false;
		} catch (error) {
			console.error("Login failed!");
			console.error(error);
			return false;
		}
	}

	private getUsers = async (): Promise<string> => {
		try {
			const url = APPLICATION_URL + "services/app/User/GetAll";
			const params = {
				method: "GET",
				headers: {
				  Accept: "application/json",
				  "Authorization": "Bearer " + this.state.accessToken,
				},
			  };
			let response = await fetch(url, params);
			let responseJson = await response.json();
			
			if (responseJson.success) {
				let result = "";
				responseJson.result.items.map(user => result += user.fullName + "; ");
				return result
			}
			return "Get users failed!"
		} catch (error) {
			console.error("Get users failed!");
			console.error(error);
		}
	}

	public render() {
		const {isLoading} = this.state;
			
		if(isLoading)
			return (
				<View style={this.styles.container}>
					<ActivityIndicator />
				</View>
			);

			return (
				<View style={this.styles.container}>
					<Text style={this.styles.heading}><h1>Login component</h1></Text>
					<TextInput style={this.styles.input} onChangeText={this.userNameChange} autoCompleteType="username" textContentType="username" />
					<TextInput style={this.styles.input} onChangeText={this.passwordChange} autoCompleteType="password" textContentType="password" secureTextEntry={true} />
					<Button onPress={this.callAPI} title="Login and fetch site users"/>
				</View>
			);
	}

	private styles = StyleSheet.create({
		container: {
			flex: 1,
		},
		heading: {
			fontFamily: "sans-serif"
		},
		input: {
			height: 40,
			borderColor: "gray",
			borderWidth: 1,
			marginBottom: 20
		},
	});
}
