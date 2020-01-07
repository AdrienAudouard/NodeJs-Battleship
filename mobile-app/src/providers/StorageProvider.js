import AsyncStorage from '@react-native-community/async-storage';

class StorageProvider {
    save(key, value) {
        AsyncStorage.setItem(key, value)
    }

    getItem(key) {
        return AsyncStorage.getItem(key);
    }
}

export default StorageProvider;
