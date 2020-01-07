import {MarkerType} from "../models/MarkerType";
import {GameImages} from "../models/Images";

class AssetsProvider {
    getImageForMarker(type) {
        switch (type) {
            case MarkerType.KILLED_BOAT:
                return GameImages.KILLED_BOAT;
            case MarkerType.PLAYER_BOAT:
                return GameImages.PLAYER_BOAT;
            case MarkerType.TARGET_HIT:
                return GameImages.TARGET_HIT;
            case MarkerType.TARGET_NO_HIT:
                return GameImages.TARGET_NO_HIT;
            default:
                return null;
        }
    }
}

export default AssetsProvider;
