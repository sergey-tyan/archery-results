import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, ScrollView, Platform, Button } from "react-native";
import { ARROWS_3 } from "./constants";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const GridItem = ({ value, isTotal, itemSelected, selected }) => {
    return (
        <TouchableHighlight onPress={()=>{
            if(!isTotal){
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


    static navigationOptions = (Platform.OS === 'android') ? { header: null } : {};


    constructor(props) {
        super(props);
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

        for (let i = 0; i < maxRow; i++) {
            let row = [];
            for (let j = 0; j < maxCol; j++) {
                row.push('');
            }
            grid.push(row);
        }

        this.state = {
            grid,
            showKeyboard: false,
            selectedItem: { row: 0, col: 0 },
            maxCol,
            maxRow,
            ended: false,
            total: 0
        };
    }

    renderRow(row, rowNum) {
        let rows = row.map((item, colNum) => {
            const selected = (rowNum === this.state.selectedItem.row && colNum === this.state.selectedItem.col)
            return <GridItem value={item} selected={selected} key={colNum} itemSelected={
                ()=> {
                    this.setState({showKeyboard:true, selectedItem: {row: rowNum, col: colNum}});
                }
            }/>;
        });

        let total = row.reduce((sum, value) => {
            if (value === 'X') {
                value = 10;
            }
            if (value === '') {
                value = 0;
            }
            return sum + parseInt(value);
        }, 0);

        rows.push(<GridItem value={total} isTotal key={row.length + 1}/>);
        return (<View style={{flexDirection:'row'}} key={rowNum}>{rows}</View>)
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
                <View style={{flexDirection:'row'}}>

                    {this.renderKeyboardItem(8)}
                    {this.renderKeyboardItem(9)}
                    {this.renderKeyboardItem(10)}
                    {this.renderKeyboardItem('X')}
                </View>
                <View style={{flexDirection:'row'}}>
                    {this.renderKeyboardItem(4)}
                    {this.renderKeyboardItem(5)}
                    {this.renderKeyboardItem(6)}
                    {this.renderKeyboardItem(7)}

                </View>
                <View style={{flexDirection:'row'}}>
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
        if(curRow > -1 && curCol > -1) {

            newGrid[this.state.selectedItem.row][this.state.selectedItem.col] = value;

            if (curCol + 1 === this.state.maxCol) {
                if (curRow + 1 === this.state.maxRow) {
                    this.setState({
                        showKeyboard: false,
                        grid: newGrid,
                        ended: true,
                        selectedItem: { row: -1, col: -1 }
                    });
                } else {
                    this.setState({
                        grid: newGrid,
                        selectedItem: { row: curRow + 1, col: 0 }
                    });
                }
            } else {
                this.setState({
                    grid: newGrid,
                    selectedItem: { row: curRow, col: curCol + 1 }
                });
            }
        }
    }

    renderKeyboardItem(value) {
        return (
            <TouchableHighlight onPress={()=>{
                this.updateSelectedItem(value);
            }}>
                <View style={styles.keyboardItem}>
                    <Text style={styles.keyboardItemValue}>{value}</Text>
                </View>
            </TouchableHighlight>
        )
    };

    countTotal(){
        let allRows = this.state.grid.reduce((row, value) => {
            return row.concat(value);
        }, []);

        let total = allRows.reduce((num, value)=>{

            if (value === 'X') {
                value = 10;
            }
            if (value === '') {
                value = 0;
            }
            return num + parseInt(value);
        },0);

        // this.setState({total});
        return total;
    }

    render() {
        return (
            <View style={{flex:1}}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    {this.renderGrid()}
                    <Text style={styles.totalText}>Total: {this.countTotal()}</Text>

                    <View style={{flexDirection:'row', flex: 1}}>
                        {
                            this.state.showKeyboard &&
                            (<View style={{flex: 1}}>
                                <Button

                                title={'Done'}
                                onPress={()=>this.setState({showKeyboard:false})}
                                />
                            </View>)
                        }
                        {
                            this.state.ended &&
                            (<View style={{flex: 1}}>
                                <Button
                                    style={{flex: 1}}
                                    title={'Copy'}
                                    onPress={()=>alert('copied')}
                                />
                            </View>)
                        }
                    </View>

                </ScrollView>

                {this.state.showKeyboard && this.renderKeyboard()}

            </View>
        )
    }


}

const styles = StyleSheet.create({
    scroll: {
        height: height,
        margin: 5
    },
    gridItem: {
        width: width / 8,
        height: width / 8,
        backgroundColor: '#82b1ff',
        borderColor: 'black',
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'center',

    },
    gridItemSelected: {
        width: width / 8,
        height: width / 8,
        backgroundColor: '#3fd34b',
        borderColor: 'black',
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'center',

    },
    gridItemTotal:{
        width: width / 8,
        height: width / 8,
        backgroundColor: '#486087',
        borderColor: 'black',
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'center',

    },

    gridItemValue: {
        alignSelf: 'center',
        fontSize: 20
    },
    keyboardItem: {
        width: width / 4 - 5,
        height: width / 4 - 5,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    keyboardItemValue: {
        alignSelf: 'center',
        fontSize: 40
    },
    keyboard:{
        margin:5,
        alignSelf:'center'
    },
    totalText:{
        fontSize:25,
        alignSelf:'center'
    }


});