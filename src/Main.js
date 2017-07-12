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
    ListView,
    Button,
    Modal,
    Switch
} from 'react-native';

import moment from 'moment';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { ARROWS_3, ARROWS_6 } from './constants';

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
            headerRight: <Button title="Add new" onPress={() => navigation.state.params.setModalVisible(true)}/>
        }
    };

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows(sample),
            modalVisible: false

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
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                    {item.total}
                </Text>
            </View>
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
                        color={'#6bf442'}
                        onPress={() => {
                            this.setModalVisible(false);
                            this.props.navigation.navigate('Points',{ mode:ARROWS_6 });
                        }}
                    />
                    <Button
                        title={'Indoor 3 arrows x 10 rounds'}
                        color={'#609dff'}
                        onPress={() => {
                            this.setModalVisible(false);
                            this.props.navigation.navigate('Points',{ mode:ARROWS_3 });
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
                        alert("Modal has been closed.")
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
        width: width - 30,
        borderRadius: 6,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black'
    },
    itemText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'black'
    },

    list: {
        flexDirection: 'column',
        width: width,
        marginBottom: 10,
    },
});

