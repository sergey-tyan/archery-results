import React, { Component } from 'react';
import {
    View,
    Platform,
    Button,
    Text,
    AsyncStorage
} from 'react-native';
import I18n from 'react-native-i18n';
import InAppBilling from 'react-native-billing';

export default class Info extends Component {

    static navigationOptions = (Platform.OS === 'android') ? {header: null} : {};

    removeAd(){
        alert(I18n.t('thanks'));
        AsyncStorage.setItem('ads_removed', 1);
    }

    buyDisableAds1() {
        InAppBilling.open()
            .then(() => InAppBilling.purchase('remove_ad'))
            .then((details) => {
                console.log("You purchased: ", details)
                this.removeAd();
                return InAppBilling.close()
            })
            .catch((err) => {
                console.log(err);
            });
    }

    buyDisableAds2() {
        InAppBilling.open()
            .then(() => InAppBilling.purchase('remove_ads_donate_1000_kzt'))
            .then((details) => {
                console.log("You purchased: ", details)
                this.removeAd();
                return InAppBilling.close()
            })
            .catch((err) => {
                console.log(err);
            });
    }

    buyDisableAds3() {
        InAppBilling.open()
            .then(() => InAppBilling.purchase('remove_ads_donate_10000_kzt'))
            .then((details) => {
                console.log("You purchased: ", details)
                this.removeAd();
                return InAppBilling.close()
            })
            .catch((err) => {
                console.log(err);
            });
    }

    restorePurchases(){
        InAppBilling.listOwnedProducts().then((arr)=>{
            if(arr.length > 0){
                this.removeAd();
            }
        });
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', width: 300, alignSelf: 'center'}}>

                <Text style={{textAlign: 'center', marginBottom: 10, fontSize: 15}}>{I18n.t('info')}</Text>

                <Button
                    title={I18n.t('buy1')}
                    color='#16bc5e'
                    onPress={() => this.buyDisableAds1()}
                />

                <Button
                    title={I18n.t('buy2')}
                    color='#1d9953'
                    onPress={() => this.buyDisableAds2()}
                />

                <Button
                    title={I18n.t('buy3')}
                    color='#33af69'
                    onPress={() => this.buyDisableAds3()}
                />

                <Button
                    title={I18n.t('restore')}
                    color='#74a83c'
                    onPress={() => this.restorePurchases()}
                />
            </View>
        )
    }
}
