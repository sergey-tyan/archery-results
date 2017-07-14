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
    Alert,
    BackHandler
} from "react-native";
import {
    AdMobInterstitial
} from 'react-native-admob';

import { ARROWS_3, ANDROID_AD_ID, IOS_AD_ID } from "./constants";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import realm from './Realm';
const GridItem = ({value, isTotal, itemSelected, selected}) => {
    return (
        <TouchableHighlight onPress={() => {
            if (!isTotal) {
                itemSelected();
            }
        }}>
            <View style={selected ? styles.gridItemSelected : isTotal ? styles.gridItemTotal : styles.gridItem}>
                <Text style={styles.gridItemValue}>{value}</Text>
            </View>
        </TouchableHighlight>
    )
};


export default class Points extends Component {
    static navigationOptions = (Platform.OS === 'android') ? {header: null} : {};

    constructor(props) {
        super(props);
        AdMobInterstitial.requestAd();
        AdMobInterstitial.isReady(() => {
            this.setState({canShowAd: true})
        });

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.state.showKeyboard) {
                    this.setState({showKeyboard: false});
                    return true;
                }
                return false;
            });
        }
    }

    componentWillMount() {
        let currentId;
        let dbItem = null;

        let ended = false;
        if (this.props.navigation.state.params.lastId) {
            currentId = this.props.navigation.state.params.lastId + 1;
            realm.write(() => {
                dbItem = realm.create('Result', {
                    id: currentId,
                    creationDate: new Date(),
                    done: false,
                    total: 0,
                    points: [],
                    type: this.props.navigation.state.params.mode
                })
            });
        } else if (this.props.navigation.state.params.itemId) {
            const items = realm.objects('Result').filtered('id == $0', this.props.navigation.state.params.itemId);
            dbItem = items[0];
            currentId = dbItem.id;
            ended = dbItem.done;
        } else {
            currentId = 1;
        }

        const grid = this.createGrid(dbItem);
        this.setState({
            grid,
            showKeyboard: false,
            selectedItem: {row: 0, col: 0},
            ended,
            currentId,
            dbItem
        });
    }

    createGrid(item) {

        let grid = [];
        let maxCol;
        let maxRow;

        if (this.props.navigation.state.params.mode === ARROWS_3) {
            maxCol = 3;
            maxRow = 10;
        } else {
            maxCol = 6;
            maxRow = 6;
        }
        this.setState({maxCol, maxRow});
        if (item) {
            let valuesArray = item.points.map(point => point.value);
            for (let i = 0; i < maxRow; i++) {
                let row = [];
                for (let j = 0; j < maxCol; j++) {
                    row.push(valuesArray[i * maxRow + j]);
                }
                grid.push(row);
            }
        } else {
            for (let i = 0; i < maxRow; i++) {
                let row = [];
                for (let j = 0; j < maxCol; j++) {
                    row.push('');
                }
                grid.push(row);
            }
        }

        return grid;
    }

    renderRow(row, rowNum) {
        let rows = row.map((item, colNum) => {
            const selected = (rowNum === this.state.selectedItem.row && colNum === this.state.selectedItem.col)
            return <GridItem value={item} selected={selected} key={colNum} itemSelected={
                () => {
                    this.setState({showKeyboard: true, selectedItem: {row: rowNum, col: colNum}});
                }
            }/>;
        });

        let total = row.reduce((sum, value) => {
            if (value === 'X') {
                value = 10;
            }
            if (value === '' || value === undefined) {
                value = 0;
            }
            return sum + parseInt(value);
        }, 0);

        rows.push(<GridItem value={total} isTotal key={row.length + 1}/>);
        return (<View style={{flexDirection: 'row'}} key={rowNum}>{rows}</View>)
    }

    renderGrid() {
        let grid = this.state.grid.map((row, rowNum) => {
            return this.renderRow(row, rowNum);
        });
        return (<View>{grid}</View>);
    }

    renderKeyboard() {
        return (
            <View style={styles.keyboard}>
                <View style={{flexDirection: 'row'}}>
                    {this.renderKeyboardItem(8)}
                    {this.renderKeyboardItem(9)}
                    {this.renderKeyboardItem(10)}
                    {this.renderKeyboardItem('X')}
                </View>
                <View style={{flexDirection: 'row'}}>
                    {this.renderKeyboardItem(4)}
                    {this.renderKeyboardItem(5)}
                    {this.renderKeyboardItem(6)}
                    {this.renderKeyboardItem(7)}
                </View>
                <View style={{flexDirection: 'row'}}>
                    {this.renderKeyboardItem(0)}
                    {this.renderKeyboardItem(1)}
                    {this.renderKeyboardItem(2)}
                    {this.renderKeyboardItem(3)}
                </View>
            </View>
        )
    }


    updateSelectedItem(value) {


        let newGrid = this.state.grid;
        const curRow = this.state.selectedItem.row;
        const curCol = this.state.selectedItem.col;
        if (curRow > -1 && curCol > -1) {

            newGrid[this.state.selectedItem.row][this.state.selectedItem.col] = value;

            if (curCol + 1 === this.state.maxCol) {
                if (curRow + 1 === this.state.maxRow) {
                    this.setState({
                        showKeyboard: false,
                        grid: newGrid,
                        ended: true,
                        selectedItem: {row: -1, col: -1}
                    }, () => {
                        if (this.state.canShowAd) {
                            AdMobInterstitial.showAd();
                        }
                        this.updateRealm();
                    });
                } else {
                    this.setState({
                        grid: newGrid,
                        selectedItem: {row: curRow + 1, col: 0}
                    }, () => this.updateRealm());
                }
            } else {
                this.setState({
                    grid: newGrid,
                    selectedItem: {row: curRow, col: curCol + 1}
                }, () => this.updateRealm());
            }
        }
    }

    updateRealm() {
        const resultItems = this.countTotal();
        realm.write(() => {
            realm.create('Result', {
                id: this.state.currentId,
                creationDate: new Date(),
                done: this.state.ended,
                total: resultItems.total,
                points: resultItems.items,
                type: this.props.navigation.state.params.mode
            }, true)
        });
    }

    renderKeyboardItem(value) {
        return (
            <TouchableHighlight
                underlayColor='#b1bed6'
                onPress={() => {
                    this.updateSelectedItem(value);
                }}>
                <View style={styles.keyboardItem}>
                    <Text style={styles.keyboardItemValue}>{value}</Text>
                </View>
            </TouchableHighlight>
        )
    };

    countTotal() {
        let allRows = this.state.grid.reduce((row, value) => {
            return row.concat(value);
        }, []);

        let total = allRows.reduce((num, value) => {

            if (value === 'X') {
                value = 10;
            }
            if (value === '' || value === undefined) {
                value = 0;
            }
            return num + parseInt(value);
        }, 0);

        let items = allRows.map((value) => {
            return {value: value === undefined ? '0' : value.toString()};
        });

        // this.setState({total});
        return {total, items};
    }

    copyToClipboard() {
        let text = '';
        let total = 0;
        for (let i = 0; i < this.state.maxRow; i++) {
            let curSum = 0;
            for (let j = 0; j < this.state.maxCol; j++) {
                text += this.state.grid[i][j] + ' | '
                let val = this.state.grid[i][j];
                if (val === 'X') {
                    val = 10;
                }
                if (val === '') {
                    val = 0;
                }
                curSum += parseInt(val);
            }
            text += '-' + curSum + '-\n';
            total += curSum;
        }

        text += 'Total: ' + total;
        Clipboard.setString(text);
    }

    showAlert() {
        Alert.alert(
            null,
            'Confirm removing Result',
            [
                {
                    text: 'Remove', onPress: () => {
                    if (this.state.dbItem) {
                        realm.write(() => {
                            realm.delete(this.state.dbItem);
                        });
                    }
                    this.props.navigation.goBack();
                }
                },
                {text: 'Cancel', style: 'cancel'}
            ],
            {cancelable: true}
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <ScrollView contentContainerStyle={this.state.maxRow === 6 ? styles.scroll6 : styles.scroll3}>
                    {this.renderGrid()}
                    <Text style={styles.totalText}>Total: {this.countTotal().total}</Text>
                    <View style={{flex: 1, justifyContent: 'flex-start'}}>
                        {
                            this.state.showKeyboard &&
                            (<View>
                                <Button
                                    title={'Done'}
                                    onPress={() => this.setState({showKeyboard: false})}
                                />
                            </View>)
                        }
                        <View>
                            <Button
                                title={'Copy'}
                                color={'#3fdb83'}
                                onPress={() => this.copyToClipboard()}
                            />
                        </View>
                        <View>
                            <Button
                                color={'#e84a4a'}
                                title={'Remove'}
                                onPress={() => {
                                    this.showAlert()
                                }}
                            />
                        </View>
                    </View>

                </ScrollView>
                {this.state.showKeyboard && this.renderKeyboard()}
            </View>
        )
    }


}

const styles = StyleSheet.create({
    scroll6: {
        height: height - 120,
        margin: 5,
        alignSelf: 'center'
    },
    scroll3: {
        height: height + 70,
        margin: 5,
        alignSelf: 'center'
    },
    gridItem: {
        width: width / 8,
        height: width / 8,
        backgroundColor: '#82b1ff',
        borderColor: '#486087',
        margin: 2,
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'center',

    },
    gridItemSelected: {
        width: width / 8,
        height: width / 8,
        backgroundColor: '#3fdb83',
        borderColor: '#486087',
        margin: 2,
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'center',

    },
    gridItemTotal: {
        width: width / 8,
        height: width / 8,
        backgroundColor: '#486087',
        borderColor: '#486087',
        borderWidth: 1,
        margin: 2,
        alignContent: 'center',
        justifyContent: 'center',
    },
    gridItemValue: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: '#353d49',
        textShadowRadius: 5,
        textShadowOffset: {width: 1, height: 1},
    },
    keyboardItem: {
        width: width / 4 - 5,
        height: width / 4 - 35,
        backgroundColor: '#d6e5ff',
        borderColor: '#82afff',
        borderWidth: 2,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 2
    },
    keyboardItemValue: {
        alignSelf: 'center',
        fontSize: 40,
        textShadowColor: '#353d49',
        textShadowRadius: 5,
        textShadowOffset: {width: 1, height: 1},
        fontWeight: 'bold'
    },
    keyboard: {
        margin: 5,
        alignSelf: 'center'
    },
    totalText: {
        fontSize: 25,
        alignSelf: 'center',
        color: 'white',
        textShadowColor: '#353d49',
        textShadowRadius: 5,
        textShadowOffset: {width: 1, height: 1},
        fontWeight: 'bold'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#353d49'
    }


});