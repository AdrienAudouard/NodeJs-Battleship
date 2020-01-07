import React from "react";
import {SafeAreaView, Text, StyleSheet, View} from "react-native";
import LottieView from 'lottie-react-native';
import {Colors} from "../models/Colors";
import GameProvider from "../providers/GameProvider";
import {goGame} from "../navigation/Navigation";

class LoadingScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: GameProvider.code
        };
    }

    componentDidMount(): void {
        GameProvider.onGameCode = (code) => {
            this.setState({
                code,
            });
        };
    }

    render() {
        const { code } = this.state;

        return(
            <SafeAreaView style={styles.container}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', margin: 10}}>
                    <Text style={styles.waitingText}>Game code:
                        <Text style={{fontWeight: 'bold'}}>
                            {' '}
                            #{code}
                        </Text>
                    </Text>
                    <LottieView
                        style={styles.lottiAnimation}
                        source={require('../assets/lottie-animations/run-hamster-run')}
                        loop={true}
                        autoPlay={true}
                        speed={1}
                    />
                    <Text style={styles.waitingText}>Waiting for players...</Text>

                </View>
            </SafeAreaView>
        )
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

export default LoadingScreen;
