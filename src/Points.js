import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
    ScrollView
} from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { ARROWS_3, ARROWS_6 } from './constants';

const GridItem = ({value, isTotal, itemSelected, selected}) => {
    return (
        <TouchableHighlight onPress={()=>{
            if(!isTotal){
                itemSelected();
            }
        }}>
            <View style={selected ? styles.gridItemSelected : styles.gridItem}>
                <Text style={styles.gridItemValue}>{value}</Text>
            </View>
        </TouchableHighlight>
    )
};


export default class Points extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        let grid = [];
        let columns;
        let rows;
        if(this.props.navigation.state.params.mode === ARROWS_3){
            columns = 3;
            rows = 10;
        }else{
            columns = 6;
            rows = 6;
        }

        for(let i = 0; i < rows; i++){
            let row = [];
            for(let j = 0; j < columns; j++){
                row.push('');
            }
            grid.push(row);
        }

        this.state = {
            grid,
            showKeyboard: false,
            selectedItem: {row: 0, col : 0}
        };
    }

    renderRow(row, rowNum){
        let rows = row.map((item, colNum)=> {
            const selected = (rowNum === this.state.selectedItem.row && colNum === this.state.selectedItem.col)
            return <GridItem value={item} selected={selected} key={colNum} itemSelected={
                ()=> {
                    this.setState({showKeyboard:true, selectedItem: {row: rowNum, col: colNum}});
                }
            }/>;
        });

        let total = row.reduce((sum, value) => {
            if(value === 'X'){
                value = 10;
            }
            if(value === ''){
                value = 0;
            }
            return sum + parseInt(value);
        }, 0);

        rows.push(<GridItem value={total} isTotal/>);
        return (<View style={{flexDirection:'row'}}>{rows}</View>)
    }

    renderGrid(){
        let grid = this.state.grid.map((row, rowNum)=> {
            return this.renderRow(row, rowNum);
        });
        return (<View>{grid}</View>);
    }

    renderKeyboard(){
        return (
            <View style={{margin:5}}>
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
                    {this.renderKeyboardItem(1)}
                    {this.renderKeyboardItem(2)}
                    {this.renderKeyboardItem(3)}
                    {this.renderKeyboardItem('<<')}
                </View>
            </View>
        )
    }


    getNextSelectedItem(){

    }

    renderKeyboardItem(value){
        return (
            <TouchableHighlight onPress={()=>{
                let newGrid = this.state.grid;

                if(value === '<<'){

                }else {
                    newGrid[this.state.selectedItem.row][this.state.selectedItem.col] = value;
                    this.setState({
                        grid: newGrid,

                    });
                }
            }}>
                <View style={styles.keyboardItem}>
                    <Text style={styles.keyboardItemValue}>{value}</Text>
                </View>
            </TouchableHighlight>
        )
    };

    render() {
        return (
            <View style={{flex:1}}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    {this.renderGrid()}
                    <Text>Total:</Text>

                </ScrollView>

                {this.state.showKeyboard && this.renderKeyboard()}

            </View>
        )
    }


}

const styles = StyleSheet.create({
    scroll:{
        height: height,
        margin: 5
    },
    gridItem:{
        width: width/9,
        height: width/9,
        backgroundColor:'#82b1ff',
        borderColor:'black',
        borderWidth:1,
        alignContent:'center',
        justifyContent:'center',
        borderRadius:5
    },
    gridItemSelected:{
        width: width/9,
        height: width/9,
        backgroundColor:'#3fd34b',
        borderColor:'black',
        borderWidth:1,
        alignContent:'center',
        justifyContent:'center',
        borderRadius:5
    },

    gridItemValue:{
        alignSelf:'center',
        fontSize:20
    },
    keyboardItem:{
        width: width/5,
        height: width/5,
        backgroundColor:'white',
        borderColor:'black',
        borderWidth:1,
        alignContent:'center',
        justifyContent:'center',
        borderRadius:10
    },
    keyboardItemValue:{
        alignSelf:'center',
        fontSize:40
    }


});