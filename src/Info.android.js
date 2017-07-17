import React, {Component} from "react";
import {
    View,
    Platform,
    Button,
} from "react-native";

import InAppBilling from 'react-native-billing'

export default class Info extends Component {

    static navigationOptions = (Platform.OS === 'android') ? {header: null} : {};

    buyDisableAds() {


        InAppBilling.open()
            .then(() => InAppBilling.purchase('remove_ad'))
            .then((details) => {
                console.log("You purchased: ", details)
                return InAppBilling.close()
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <View>

                <Button
                    title={'Buy'}
                    onPress={() => this.buyDisableAds()}
                />


            </View>
        )
    }
}