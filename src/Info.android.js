import React, { Component } from "react";
import {
    Clipboard,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
    ScrollView,
    Platform,
    Button,
    Alert
} from "react-native";

export default class Info extends Component {

    static navigationOptions = (Platform.OS === 'android') ? {header: null} : {};

    render() {
        return (
            <View>
                <Text>ANDROID BOUUU</Text>
            </View>
        )
    }
}