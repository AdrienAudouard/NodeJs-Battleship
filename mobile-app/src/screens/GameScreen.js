import React from "react";
import {Alert, SafeAreaView, StyleSheet, View} from "react-native";
import {Colors} from "../models/Colors";
import GameBoard from "../widgets/GameBoard";
import {Button, Text} from "react-native-elements";
import GameProvider from "../providers/GameProvider";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import Icon from 'react-native-vector-icons/FontAwesome';
import {goHome} from "../navigation/Navigation";

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

    quitGame() {
        Alert.alert('Attention', 'Do you want to quit the game ?', [
            { text: 'Yes', onPress: () => {
                GameProvider.quitGame();
                goHome();
                }
            },
            { text: 'No' }
        ]);
    }

    render() {
        const { boardSize } = this.props;
        const { playerPoints, ennemyMarkers, isPlayerTurn } = this.state;

        const infoText = isPlayerTurn ? 'It\'s your turn' : 'It\'s the enemy\'s turn';

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button
                            pres
                            icon={
                                <Icon
                                    name="cog"
                                    size={30}
                                    color="white"
                                />
                            }
                            buttonStyle={{backgroundColor: ''}}
                            onPress={() => {this.quitGame()}}
                        />
                        <AnimatedCircularProgress
                            size={30}
                            ref={(ref) => this.circularProgress = ref}
                            width={7}
                            fill={0}
                            rotation={0}
                            tintColor="#00e0ff"
                            backgroundColor="#3d5875" />
                    </View>
                    <Text h3 style={styles.title}>{ infoText }</Text>
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
