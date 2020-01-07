import React from "react";
import {KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {Button, ListItem, Text, ThemeProvider} from "react-native-elements";
import GameProvider from "../providers/GameProvider";
import Icon from 'react-native-vector-icons/FontAwesome';
import {goHome, goJoin, goLoading} from "../navigation/Navigation";
import {Colors} from "../models/Colors";
import NoGameFound from "../widgets/NoGameFound";

const CHEVRON_RIGHT_ICON = <Icon name="chevron-right" size={24} color="#27ae60" />;

class JoinScreen extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            games: GameProvider.games,
        };
    }

    componentDidMount() {
        GameProvider.onGamesUpdate = (games) => {
            this.setState({
                games,
            });
        };
    }

    joinGame(game) {
        GameProvider.joinGame(game);
        goLoading();
    }

    render() {
        const { games } = this.state;
        let gameListContainer = games.map((game, index) => (
            <ListItem
                key={index}
                containerStyle={styles.listItemContainer}
                title={game.host}
                titleStyle={styles.listItemTitle}
                subtitle={'#' + game.code}
                subtitleStyle={styles.listItemSubtitle}
                rightIcon={CHEVRON_RIGHT_ICON}
                bottomDivider
                onPress={() => {this.joinGame(game);}}
            />
        ));

        if (games.length === 0) {
            gameListContainer = (<NoGameFound></NoGameFound>);
        }


        return(
            <SafeAreaView style={styles.mainContainer}>
                    <ThemeProvider>
                        <View style={styles.container}>
                            <Text h2 style={styles.title}>Available games</Text>
                            <ScrollView>
                                {
                                    gameListContainer
                                }
                            </ScrollView>
                            <Button
                                buttonStyle={styles.buttonStyle}
                                titleStyle={styles.buttonTitleStyle}
                                title="Back to home"
                                onPress={() => { goHome(); }}
                            />
                        </View>
                    </ThemeProvider>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    container: {
        flex: 1,
        margin: 10,
        backgroundColor: Colors.primary
    },
    title: {
        textAlign: 'center',
        marginBottom: 50,
        color: Colors.secondary
    },
    listItemContainer: {
      backgroundColor: Colors.primary,
    },
    listItemSubtitle: {
        fontStyle: 'italic',
        color: Colors.secondary,
    },
    listItemTitle: {
        color: Colors.secondary,
        fontWeight: '800',
    },
    buttonStyle: {
        backgroundColor: Colors.buttonColor
    },
    buttonTitleStyle: {
        color: Colors.primary,
        fontWeight: '600'
    }
});

export default JoinScreen;
