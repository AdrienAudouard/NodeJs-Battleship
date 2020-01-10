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
            gameBoardHeight: 100,
            playerBoardHeight: 100
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

    updateBoardsSize(event) {
        let {height} = event.nativeEvent.layout;

        this.setState({
            gameBoardHeight: height * 0.45,
            playerBoardHeight: height * 0.25
        });
    }

    render() {
        const { boardSize } = this.props;
        const { playerPoints, ennemyMarkers, isPlayerTurn, gameBoardHeight, playerBoardHeight } = this.state;

        const infoText = isPlayerTurn ? 'It\'s your turn' : 'It\'s the enemy\'s turn';

        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', margin: 10}}
                    onLayout={(event => this.updateBoardsSize(event))}
                >
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
                    <GameBoard maxHeight={gameBoardHeight} size={boardSize} markers={ennemyMarkers} />
                    <GameBoard maxHeight={playerBoardHeight} disableButtons={true} size={boardSize} markers={playerPoints} />
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
