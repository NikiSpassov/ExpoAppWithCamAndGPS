import React, { ReactNode } from "react";
import { View, StyleSheet, Text, Button, Image, ActivityIndicator } from "react-native";
import CameraHandler from "./CameraHandler";
import { CapturedPicture } from "expo-camera/build/Camera.types";
import * as Location from "expo-location";
import LocationService from "../services/LocationService";

export interface POCAppState {
    photo: CapturedPicture,
    cameraMode: boolean,
    loadingLocation: boolean,
    location: Location.LocationData
}
export interface POCAppProps {}

export default class POCApp extends React.Component<POCAppProps, POCAppState> {
    constructor(props: POCAppProps) {
        super(props);
        this.state = {
            photo: undefined,
            cameraMode: false,
            loadingLocation: false,
            location: undefined
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

    public render = (): ReactNode => {
        const { cameraMode, photo, location, loadingLocation } = this.state;

        return (
            <View style={this.styles.container}>
                {cameraMode && 
                    <CameraHandler
                        onPictureTaken={this.getPictureFromCamera}
                    />}

                {!cameraMode &&
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
                </View> }
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
      });
}