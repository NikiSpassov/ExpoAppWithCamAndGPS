import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

export interface ILocationService {
    getLocationAsync: () => Promise<Location.LocationData>
}

export default class LocationService {
    public getLocationAsync = async (): Promise<Location.LocationData> => {
        this.checkPlatform();
        await this.checkPermissions();

        return Location.getCurrentPositionAsync({});
    }

    private checkPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.LOCATION);
        if (response.status !== "granted")
            throw new Error("Permission to access location was denied");
    }

    private checkPlatform = () => {
        if (Platform.OS === "android" && !Constants.isDevice)
			throw new Error("This will not work on Sketch in an Android emulator. Try it on your device!");
    }
}