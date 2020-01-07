import React from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import {Colors} from "../models/Colors";
import GameBoard from "../widgets/GameBoard";
import {Text} from "react-native-elements";
import GameProvider from "../providers/GameProvider";
import {AnimatedCircularProgress} from "react-native-circular-progress";

class GameScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            playerPoints: [],
        }
    }

    componentDidMount(): void {
        const { game } = this.props;
        const playerPoints = [];

        this.setState({
           playerPoints: GameProvider.playerMarkers,
            isPlayerTurn: GameProvider.isPlayerTurn
        });

        GameProvider.onBoardHitted = (markers) => {
            this.setState({
                playerPoints: markers
            });
        };

        GameProvider.onNewMarker = (markers) => {
          this.setState({
            ennemyMarkers: markers
          });
        };

        GameProvider.onTurnChange = (isPlayerTurn) => {
            if (this.circularProgress) {
                this.circularProgress.reAnimate(0, 100, 30 * 1000);
            }

            this.setState({
                isPlayerTurn
            });
        };
    }

    render() {
        const { boardSize } = this.props;
        const { playerPoints, ennemyMarkers, isPlayerTurn } = this.state;

        const infoText = isPlayerTurn ? 'It\'s your turn' : 'It\'s the enemy\'s turn';

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', margin: 10}}>
                    <Text h3 style={styles.title}>{ infoText }</Text>
                    <AnimatedCircularProgress
                        size={50}
                        ref={(ref) => this.circularProgress = ref}
                        width={7}
                        fill={0}
                        rotation={0}
                        tintColor="#00e0ff"
                        backgroundColor="#3d5875" />
                    <GameBoard size={boardSize} markers={ennemyMarkers} />
                    <GameBoard maxHeight={200} disableButtons={true} size={boardSize} markers={playerPoints} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    title: {
        textAlign: 'center',
        color: Colors.secondary,
    },
});

export default GameScreen;
