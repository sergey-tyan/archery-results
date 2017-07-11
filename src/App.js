/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import moment from 'moment';

const ThreeXTen = '3x10';
const SixXSix = '6x6';

const sample = [
    {
        date: moment().format("YYYY.MM.DD HH:mm"),
        total: 234,
        distance: 70,
        points: {
            type: ThreeXTen,
            scores:[[9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10]]
        }
    },
    {
        date: moment().format("YYYY.MM.DD HH:mm"),
        total: 150,
        distance: 70,
        points: {
            type: SixXSix,
            scores:[[9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10]]
        }
    },

];

class Item extends Component {

}

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.android.js
                </Text>
                <Text style={styles.instructions}>
                    Double tap R on yoursds keyboard to relsdoad,{'\n'}
                    цеа
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#ba4432',
        marginBottom: 5,
    },
});

