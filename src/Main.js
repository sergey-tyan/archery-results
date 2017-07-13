/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Button,
    Modal,
    TouchableHighlight
} from 'react-native';

import moment from 'moment';
import realm from './Realm';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { ARROWS_3, ARROWS_6 } from './constants';
import { ListView } from 'realm/react-native';

const sample = [
    {
        date: moment().format("YYYY.MM.DD HH:mm"),
        total: 234,
        distance: 70,
        points: {
            type: ARROWS_3,
            scores: [[9, 9, 10],
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
            type: ARROWS_6,
            scores: [[9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10]]
        }
    },
    {
        date: moment().format("YYYY.MM.DD HH:mm"),
        total: 150,
        distance: 70,
        points: {
            type: ARROWS_6,
            scores: [[9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10]]
        }
    }
];

export default class Main extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Archery Results',
            headerRight: <Button title="Add new" onPress={() => navigation.state.params.setModalVisible(true)}/>,
            headerLeft: <Button title="Info" onPress={() => navigation.navigate('Info')}/>
        }
    };

    constructor(props) {
        super(props);
        console.log('CONSTRUCTOR LOGS');
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.resultItems = realm.objects('Result').sorted('creationDate', true);
        // if (this.resultItems.length < 1) {
        //     realm.write(() => {
        //         realm.create('Result', {
        //             id:1,
        //             creationDate: new Date(),
        //             done: false,
        //             total: 300,
        //             points: [{value: 'X'}, {value: '10'}, {value: 'X'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}],
        //             type: ARROWS_3
        //         });
        //     });
        // }
        let lastId = 0;
        if(this.resultItems.length > 0){
            lastId = this.resultItems[0].id;
        }

        this.resultItems.addListener((collection) => {
            if(collection.length > 0) {
                lastId = collection[0].id;
            }

            this.setState({lastId, dataSource: ds.cloneWithRows(collection)});
        });

        this.state = {
            dataSource: ds.cloneWithRows(this.resultItems),
            modalVisible: false,
            lastId
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({setModalVisible: this.setModalVisible.bind(this)});
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    renderItem(item) {
        return (
            <TouchableHighlight onPress={()=>{
                this.props.navigation.navigate('Points',{ mode:item.type, itemId: item.id })
            }}>
                <View style={styles.itemContainer}>
                    <View style={item.done ? styles.totalDone : styles.totalProgress}>
                        <Text style={styles.itemText}>
                            {item.total}{item.type === ARROWS_3 ? '/300' : '/360'}
                        </Text>
                    </View>
                    <View style={styles.date}>
                        <Text style={styles.itemText}>
                            {moment(item.creationDate).format("YYYY.MM.DD HH:mm")}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    renderModal() {
        return (
            <View style={styles.modalContainer}>
                <Text style={styles.modalText}>
                    Shooting mode
                </Text>
                <View style={styles.rowContainer}>
                    <Button
                        title={'Outdoor 6 arrows x 6 rounds'}
                        color={'#3fdb83'}
                        onPress={() => {
                            this.setModalVisible(false);
                            this.props.navigation.navigate('Points',{ mode:ARROWS_6, lastId: this.state.lastId });
                        }}
                    />
                    <Button
                        title={'Indoor 3 arrows x 10 rounds'}
                        color={'#609dff'}
                        onPress={() => {
                            this.setModalVisible(false);
                            this.props.navigation.navigate('Points',{ mode:ARROWS_3, lastId: this.state.lastId });
                        }}
                    />
                    <Button
                        title={'Cancel'}
                        color={'#e84a4a'}
                        onPress={() => this.setModalVisible(false)}
                    />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    supportedOrientations={['portrait']}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}
                >
                    {this.renderModal()}
                </Modal>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    style={styles.list}
                    scrollbarStyle="outsideOverlay"
                    enableEmptySections
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    modalContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',

        width: height / 2,
        height: height / 4,
        alignSelf: 'center',
        marginTop: height / 6,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: 'red',
    },
    rowContainer: {
        margin: 10
    },
    modalText: {
        fontSize: 18,
        margin:5
    },
    itemContainer: {
        height: 50,
        width: width,
        justifyContent: 'flex-start',
        alignSelf: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#21a5d1',
        flexDirection:'row'
    },
    itemText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'black',
    },
    list: {
        flexDirection: 'column',
        width: width,
        marginBottom: 10,
    },
    totalDone:{
        backgroundColor:'#3fdb83',
        width: width/2
    },
    totalProgress:{
        backgroundColor:'#def24b',
        width: width/2
    },
    date:{
        width: width/2,
        backgroundColor:'#aac8ff'
    }
});

