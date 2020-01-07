import React from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import LottieView from "lottie-react-native";
import {Colors} from "../models/Colors";

class NoGameFound extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', margin: 10}}>
                    <Text style={styles.waitingText}>No game found
                    </Text>
                    <LottieView
                        style={styles.lottiAnimation}
                        source={require('../assets/lottie-animations/12548-radar')}
                        loop={true}
                        autoPlay={true}
                        speed={1}
                    />
                    <Text style={styles.waitingText}>Searching game...</Text>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    lottie: {
        width: 100,
        height: 100
    },
    waitingText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 30
    },
    lottiAnimation: {
        width: 300,
        height: 300,
        backgroundColor: Colors.primary
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
});

export default NoGameFound;
