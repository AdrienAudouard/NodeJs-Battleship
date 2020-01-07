import {Navigation} from "react-native-navigation";
import HomeScreen from "../screens/HomeScreen";
import JoinScreen from "../screens/JoinScreen";
import LoadingScreen from "../screens/LoadingScreen";
import GameScreen from "../screens/GameScreen";

export function registerScreens() {
    Navigation.registerComponent('Home', () => HomeScreen);
    Navigation.registerComponent('Join', () => JoinScreen);
    Navigation.registerComponent('Loading', () => LoadingScreen);
    Navigation.registerComponent('Game', () => GameScreen);
}
