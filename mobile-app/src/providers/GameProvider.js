import SocketProvider from "./SocketProvider";
import {goGame, goHome} from "../navigation/Navigation";
import {MarkerType} from "../models/MarkerType";
import Marker from "../models/Marker";
import { Alert } from 'react-native';
import StorageProvider from "./StorageProvider";

class GameProvider {
    constructor() {
        this.games = [];
        this.code = '';
        this.ennemyMarkers = [];
        this.playerMarkers = [];
        this.isPlayerTurn = false;
        this.storageProvider = new StorageProvider();

        this.onGamesUpdate = (games) => {};
        this.onGameCode = (code) => {};
        this.onGameStart = (board, gameSize) => {};
        this.onNewMarker = (markers) => {};
        this.onBoardHitted = (markers) => {};
        this.onTurnChange = (isPlayerTurn) => {};

        this.provider = SocketProvider;
        this.initListeners();

        this.provider.askGames();
    }

    initListeners() {
        this.provider.onJoinableGames = (games) => {
            this.games = games;
            this.onGamesUpdate(games);
        };

        this.provider.onGameCode = (code) => {
            this.code = code;
            this.onGameCode(code);
        };

        this.provider.onGameStart = (board, gameSize) => {
            this.markers = [];
            this.playerMarkers = [];
            this.initPlayerMarker(board);

            goGame(board, gameSize);
            this.onGameStart(board, gameSize);
        };

        this.provider.onNewMarker = (x, y, touched, killed, lastBoatTouched) => {
            const newMarker = this.createMarker(touched, killed, x, y, lastBoatTouched);

            if (killed) {
                this.ennemyMarkers.filter((m) => m.tag === lastBoatTouched).forEach((m) => m.type = MarkerType.KILLED_BOAT);
            }

            this.ennemyMarkers.push(newMarker);
            this.onNewMarker(this.ennemyMarkers);
        };

        this.provider.onBoardHited = (x, y, touched, killed, lastBoatTouched) => {
            const newMarker = this.createMarker(touched, killed, x, y, lastBoatTouched);

            if (killed) {
                this.playerMarkers.filter((m) => m.tag === lastBoatTouched).forEach((m) => m.type = MarkerType.KILLED_BOAT);
            }

            this.playerMarkers.push(newMarker);
            this.onBoardHitted(this.playerMarkers);
        };

        this.provider.onStartTurn = () => {
            this.isPlayerTurn = true;
            this.onTurnChange(true);
        };

        this.provider.onEndTurn = () => {
            this.isPlayerTurn = false;
            this.onTurnChange(false);
        };

        this.provider.onWin = () => {
            this.showAlertAndGoHome( 'Well done champion 👑', 'You won the game');
        };

        this.provider.onLoose = () => {
            this.showAlertAndGoHome('You lost the game.')
        };

        this.provider.onGameEndWithError = (msg) => {
            this.showAlertAndGoHome(msg, 'Error');
        }
    }

    createMarker(touched, killed, x, y, lastBoatTouched) {
        const type = touched ? (killed ? MarkerType.KILLED_BOAT : MarkerType.TARGET_HIT) : MarkerType.TARGET_NO_HIT;
        const newMarker = new Marker(x, y, type);

        if (touched) {
            newMarker.tag = lastBoatTouched;
        }
        return newMarker;
    }

    showAlertAndGoHome(message, title = 'Message') {
        Alert.alert(title, message, [
            {
                text: 'Ok', onPress: () => { goHome(); }
            }
        ]);
    }

    initPlayerMarker(game) {
        game.forEach((boat) => {
            boat.points.forEach((point) => {
                this.playerMarkers.push(new Marker(point.x, point.y, MarkerType.PLAYER_BOAT));
            });
        });
    }

    joinGame(game) {
        this.code = game.code;
        this.provider.joinGame(game);
    }

    createGame(pseudo, gameType, boats, boardSize, boatsCannotTouch) {
        const game = `${gameType}-${boats}-${boatsCannotTouch}-${boardSize}`;
        this.storageProvider.save('pseudo', pseudo);
        this.provider.createGame(game, pseudo);
    }

    shoot(x, y) {
        if (this.isPlayerTurn) {
            this.provider.addNewMarker(x, y);
        }
    }

    quitGame() {
        this.provider.quitGame();
    }
}

export default new GameProvider();
