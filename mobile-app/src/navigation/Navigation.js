import {Navigation} from 'react-native-navigation';

export const goHome = () => Navigation.setRoot(returnNavigationObject('Home'));
export const goJoin = () => Navigation.setRoot(returnNavigationObject('Join'));
export const goLoading = () => Navigation.setRoot(returnNavigationObject('Loading'));
export const goGame = (game, boardSize) => Navigation.setRoot({
    root: {
        stack: {
            id: 'App',
            children: [
                {
                    component: {
                        name: 'Game',
                        passProps: {
                            game, boardSize
                        },
                        options: {
                            topBar: {
                                visible: false,
                            },
                        },
                    },
                },
            ],
        },
    },
});

const returnNavigationObject = screen => ({
    root: {
        stack: {
            id: 'App',
            children: [
                {
                    component: {
                        name: screen,
                        options: {
                            topBar: {
                                visible: false,
                            },
                        },
                    },
                },
            ],
        },
    },
});
