import {
    StackNavigator,
} from 'react-navigation';
import Main from './Main';
import Points from './Points';
const App = StackNavigator({
    Main: {screen: Main},
    Points: {screen: Points},
});

export default App;