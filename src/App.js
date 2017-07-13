import {
    StackNavigator,
} from 'react-navigation';
import Main from './Main';
import Points from './Points';
import Info from './Info';
import {
    AdMobInterstitial
} from 'react-native-admob';
import  { Platform } from 'react-native';
import { ANDROID_AD_ID, IOS_AD_ID } from "./constants";
const App = StackNavigator({
    Main: {screen: Main},
    Points: {screen: Points},
    Info: {screen: Info}
});
AdMobInterstitial.setAdUnitID((Platform.OS === 'android') ? ANDROID_AD_ID : IOS_AD_ID);
AdMobInterstitial.setTestDeviceID('EMULATOR');

export default App;