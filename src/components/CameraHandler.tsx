import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { CapturedPicture } from "expo-camera/build/Camera.types";

export interface CameraHandlerState {
	hasCameraPermission: boolean,
	cameraType: any 
}

export interface CameraHandlerProps {
	onPictureTaken: (photo: CapturedPicture) => void,
}

export default class CameraHandler extends React.Component<CameraHandlerProps, CameraHandlerState> {
	private camera: any;

	constructor(props: CameraHandlerProps) {
        super(props);
        this.state = {
			hasCameraPermission: null,
			cameraType: Camera.Constants.Type.back,
		};
    }
	
	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === "granted" });
	}

	private flipButton = () => {
		const cameraType = Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back;
		this.setState({cameraType});
	}

    private takePicture = () => {
        if (this.camera) {
            this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
        }
    };

    private onPictureSaved = (photo: CapturedPicture) => {
		if (this.props.onPictureTaken)
			this.props.onPictureTaken(photo);
    } 

	public render() {
		const { hasCameraPermission, cameraType } = this.state;
		
		if (hasCameraPermission === null)
			return <View />;
		else if (hasCameraPermission === false)
			return <Text>No access to camera</Text>;
		else
			return (
				<View style={this.styles.container}>
					<Camera style={this.styles.camera} type={cameraType} ref={(ref) => { this.camera = ref }}>
						<View style={this.styles.lowerButtons} >
							<TouchableOpacity
								style={{}}
								onPress={this.flipButton}>
								<Text style={this.styles.flipButtonText}> Flip </Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={this.styles.shutter} 
								onPress={this.takePicture} />
							<View></View>
						</View>
					</Camera>
				</View>
			);
	}

	private styles = StyleSheet.create({
		container: {
			flex: 1,
		},
        camera: {
          	flex: 1,
          	backgroundColor: "#fff",
          	alignItems: "center",
			justifyContent: "center",
			flexDirection: "row"
		},
		placeholder: {
			flex: 1,
			backgroundColor: "transparent",
			flexDirection: "column",
		},
		lowerButtons: {
			alignSelf: "flex-end",
			alignItems: "center",
			justifyContent: "space-between",
			flex: 1,
			flexDirection: "row",
		},
		flipButtonText: { 
			fontSize: 18, 
			color: "white",
		},
		shutter: {
			width:60, 
			height:60, 
			borderRadius:30,
			marginRight: 45,
			backgroundColor:"white",
		},
	});
}
