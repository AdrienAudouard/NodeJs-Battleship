/**
 * @format
 */

import {registerScreens} from "./src/navigation/Screens";
import {Navigation} from "react-native-navigation";

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: 'Home',
            }
        }
    })
});
