import React from "react";

import {ImageBackground, StyleSheet, TouchableOpacity, View} from "react-native";
import {Colors} from "../models/Colors";
import PropTypes from 'prop-types';
import GameProvider from "../providers/GameProvider";
import AssetsProvider from "../providers/AssetsProvider";

class GameBoard extends React.Component {
    constructor() {
        super();
        this.assetsLoader = new AssetsProvider();
        this.state = {
            squareWidth: 1,
            isPlayerTurn: false,
        };
    }

    render() {
        const { size, squareBackgroundColor, squareBorderColor, disableButtons } = this.props;
        const {squareWidth} = this.state;
        const rows = this.generateButtons(squareWidth, squareBorderColor, squareBackgroundColor, size, disableButtons);

        return (
            <View
                style={[styles.columnContainer, { height: squareWidth * size }]}
                onLayout={(event) => {
                    this.onLayout(event);
                }}
            >
                { rows }
            </View>
        );
    }

    onLayout(event) {
        const stateSquareWidth = this.state.squareWidth;
        const {size} = this.props;

        let {width} = event.nativeEvent.layout;

        if (this.props.maxHeight && width > this.props.maxHeight) {
            width = this.props.maxHeight;
        }

        const squareWidth = width / size;

        if (squareWidth !== stateSquareWidth) {
            this.setState({
                squareWidth
            });
        }
    }

    getBackground(x, y) {
        const { markers } = this.props;

        if (!this.isMarked(x, y)) {
            return null;
        }

        return markers.filter((el) => el.x === x && el.y === y).map((el) => {
            return (
                <ImageBackground style={styles.imgBackground}
                                 resizeMode='cover'
                                 source={this.assetsLoader.getImageForMarker(el.type)}>
                </ImageBackground>
            );
        });
    }

    isMarked(x, y) {
        const { markers } = this.props;

        return markers.find( el => el.x === x && el.y === y) !== undefined;
    }

    onClick(x, y) {
        if (this.isMarked(x, y)) {
            return;
        }

        GameProvider.shoot(x, y);
    }

    generateButtons(squareWidth, squareBorderColor, squareBackgroundColor, size, disableButtons) {
        const buttons = [];
        const rows = [];
        const squareAdditionnalStyle = {
            height: squareWidth,
            borderColor: squareBorderColor,
            backgroundColor: squareBackgroundColor
        };

        for (let i = 0; i < size; i++) {
            buttons[i] = [];
            for (let j = 0; j < size; j++) {
                buttons[i].push(
                    <TouchableOpacity
                        disabled={disableButtons}
                        style={[styles.square, squareAdditionnalStyle]}
                        onPress={() => this.onClick(j, i)}
                    >
                        {
                            this.getBackground(j, i)
                        }
                    </TouchableOpacity>
                )
            }
        }
        this.generateMainContainer(size, rows, buttons);
        return rows;
    }

    generateMainContainer(size, rows, buttons) {
        const { maxHeight } = this.props;
        const additionnalStyle = {};

        if (maxHeight) {
            additionnalStyle.maxWidth = maxHeight;
        }

        for (let i = 0; i < size; i++) {
            rows.push(
                <View
                    key={`row-${i}`}
                    style={[styles.rowContainer, additionnalStyle]}
                >
                    {buttons[i]}
                </View>
            )
        }
    }
}

GameBoard.propType = {
  squareBackgroundColor: PropTypes.string,
    squareBorderColor: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    markers: PropTypes.array,
    disableButtons: PropTypes.bool,
    maxHeight: PropTypes.number,
};

GameBoard.defaultProps = {
    squareBackgroundColor: Colors.squareBackground,
    squareBorderColor: Colors.secondary,
    markers: [],
    disableButtons: false,
};

const styles = StyleSheet.create({
    columnContainer: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    square: {
        flex: 1,
        borderWidth: 1,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'green',
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
    },
});

export default GameBoard;
