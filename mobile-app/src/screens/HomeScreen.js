import React from "react";
import {ThemeProvider, Button, Text, Input, CheckBox} from "react-native-elements";
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    View, Alert
} from "react-native";
import {Dropdown} from "react-native-material-dropdown";
import {goJoin, goLoading} from "../navigation/Navigation";
import GameProvider from "../providers/GameProvider";
import {Colors} from "../models/Colors";
import StorageProvider from "../providers/StorageProvider";

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boatsCannotTouch: true,
            gameType: '1',
            boats: '4-3-2-2',
            boardSize: '10',
            pseudo: '',
        }
    }

    componentDidMount(): void {
        const storageProvider = new StorageProvider();
        storageProvider.getItem('pseudo').then((pseudo) => {
           if (pseudo !== null) {
               this.setState({
                   pseudo
               });
           }
        });
    }

    goToJoinScreen() {
        goJoin();
    }

    createGame() {
        const {boatsCannotTouch, gameType, boats, boardSize, pseudo} = this.state;

        if (pseudo === '') {
            Alert.alert('Error', 'Please enter a pseudo !');
            return;
        }

        GameProvider.createGame(pseudo, gameType, boats, boardSize, boatsCannotTouch);
        goLoading();
    }

    render() {
        const { boardSize, boats, gameType } = this.state;

        const gameTypesValues = [
            { value: '2', label: '1 vs 1' },
            { value: '1', label: '1 vs IA',}
            ];

        const boatsValues = [
            { value: '1'},
            { value: '4-3-2-2', label: '4, 3, 2, 2'},
            { value: '6-5-4-3-2', label: '6, 5, 4, 3, 2'},
            { value: '2-2-2-2-2-2', label: '2, 2, 2, 2, 2, 2'},
            { value: '6-6-6-6-6-6', label: '6, 6, 6, 6, 6, 6'},
        ];

        const boardSizeValues = [
            { value: '8' },
            { value: '10' },
            { value: '12' },
            { value: '14' },
            { value: '16' },
        ];

        return (
            <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ThemeProvider>
                            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', margin: 10}}>
                                <Text h1 style={styles.title}>Battleship</Text>
                                <Text h2 style={styles.title}>Create a game</Text>
                                <Input
                                    placeholder='Pseudo'
                                    placeholderTextColor={'#bdc3c7'}
                                    onChangeText={(text => this.setState({pseudo: text}))}
                                    inputStyle={{padding: 0, margin: 0, color: Colors.secondary}}
                                    value={this.state.pseudo}
                                    //errorMessage="Pseudo is required"
                                />
                                <Dropdown
                                    textColor={Colors.secondary}
                                    baseColor={'#bdc3c7'}
                                    selectedItemColor={'#000'}
                                    label='Game type'
                                    value={gameType}
                                    onChangeText={(value) => { this.setState({gameType: value}) }}
                                    containerStyle={styles.dropDown}
                                    data={gameTypesValues}
                                />
                                <Dropdown
                                    textColor={Colors.secondary}
                                    baseColor={'#bdc3c7'}
                                    selectedItemColor={'#000'}
                                    label='Boats'
                                    value={boats}
                                    onChangeText={(value) => { this.setState({boats: value}) }}
                                    containerStyle={styles.dropDown}
                                    data={boatsValues}
                                />
                                <Dropdown
                                    textColor={Colors.secondary}
                                    baseColor={'#bdc3c7'}
                                    selectedItemColor={'#000'}
                                    label='Board size'
                                    value={boardSize}
                                    onChangeText={(value) => { this.setState({boardSize: value}) }}
                                    containerStyle={styles.dropDown}
                                    data={boardSizeValues}
                                />
                                <CheckBox
                                    title='Boats cannot touch each other'
                                    checked={this.state.boatsCannotTouch}
                                    textStyle={{color: Colors.secondary}}
                                    containerStyle={styles.checkbox}
                                    iconRight
                                    onPress={() => this.setState({boatsCannotTouch: !this.state.boatsCannotTouch})}
                                />
                                <Button
                                    buttonStyle={styles.buttonStyle}
                                    title="Create"
                                    titleStyle={styles.buttonTitleStyle}
                                    onPress={() => {this.createGame()}}
                                />
                                <Button
                                    buttonStyle={styles.buttonStyle}
                                    titleStyle={styles.buttonTitleStyle}
                                    title="Join a game"
                                    onPress={() => this.goToJoinScreen()}
                                />
                            </View>
                        </ThemeProvider>
                    </TouchableWithoutFeedback>
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
        color: Colors.secondary
    },
    dropDown: {
        marginLeft: 10,
        marginRight: 10,
    },
    checkbox: {
        color: Colors.secondary,
        backgroundColor: Colors.primary,
        borderWidth: 0,
        paddingLeft: 0,
        marginLeft: 0
    },
    buttonStyle: {
        backgroundColor: Colors.buttonColor
    },
    buttonTitleStyle: {
        color: Colors.primary,
        fontWeight: '600'
    }
});

export default HomeScreen;
