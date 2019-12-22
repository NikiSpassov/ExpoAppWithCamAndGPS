import React, { ReactNode } from "react";
import { View, StyleSheet, Text, Button, Image, ActivityIndicator } from "react-native";
import CameraHandler from "./CameraHandler";
import { CapturedPicture } from "expo-camera/build/Camera.types";
import * as Location from "expo-location";
import LocationService from "../services/LocationService";
import Login from "./Login";

export interface POCAppState {
    photo: CapturedPicture,
    cameraMode: boolean,
    loadingLocation: boolean,
    location: Location.LocationData,
    showLoginControls: boolean,
    loginInfo: string,
}
export interface POCAppProps {}

export default class POCApp extends React.Component<POCAppProps, POCAppState> {
    constructor(props: POCAppProps) {
        super(props);
        this.state = {
            photo: undefined,
            cameraMode: false,
            loadingLocation: false,
            location: undefined,
            showLoginControls: false,
            loginInfo: undefined
        }
    }

    private cameraOn = () => {
        this.setState({
            cameraMode: true,
        });
    }

    private getPictureFromCamera = (photo: CapturedPicture) => {
        this.setState({
            photo,
            cameraMode: false,
        });
    } 

    private getLocation = async () => {
        this.setState({ loadingLocation: true });
        const locationService = new LocationService();
        const location = await locationService.getLocationAsync();
        this.setState({
            location,
            loadingLocation: false
         });
    }

    private showLogin = () => {
        this.setState({
            showLoginControls: true
        });
    }

    private getMessageFromLogin = (message: string) => {
        this.setState({
            showLoginControls: false,
            loginInfo: message,
        });
    }

    public render = (): ReactNode => {
        const { cameraMode, photo, location, loadingLocation, showLoginControls, loginInfo } = this.state;

        if (cameraMode)
            return (<View style={this.styles.container}>
                {cameraMode && 
                    <CameraHandler
                        onPictureTaken={this.getPictureFromCamera}
                    />}
                    </View>);
        
        if (showLoginControls)
            return ( <View style={this.styles.container}>
                {showLoginControls && 
                    <Login
                        getMessageFromLogin={this.getMessageFromLogin}
                />}</View>);

        return (
            <View style={this.styles.container}>
                <View style={this.styles.controls}>
                    <View style={this.styles.cameraButton} >
                        <Button onPress={this.cameraOn} title="Camera"/>
                    </View>
                    {!!photo && <Image source={{ uri: photo.uri }} style={this.styles.photo} />}
                    <View style={this.styles.locationButton} >
                        <Button onPress={this.getLocation} title="Location"/>
                    </View>
                    {loadingLocation && <ActivityIndicator />}
                    {!!location && <Text>{ JSON.stringify(location) }</Text>}
                    <View style={this.styles.loginButton} >
                        <Button onPress={this.showLogin} title="Login"/>
                    </View>
                    {!!loginInfo && <Text>{ loginInfo }</Text>}
                </View>
            </View>
        );
    }

    private styles = StyleSheet.create({
        container: {
            backgroundColor: "transparent",
            flex: 1,
            justifyContent: "center"
        },
        photo: {
            width: 200,
            height: 200,
        },
        controls: {
           justifyContent: "center",
           margin: 20,
           
        },
        cameraButton: {
            marginTop: 20,
            marginBottom: 20
        },
        locationButton: {
            marginTop: 20,
            marginBottom: 20
        },
        loginButton: {
            marginTop: 20,
            marginBottom: 20
        },
      });
}