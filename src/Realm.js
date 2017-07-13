'use strict';

import Realm from 'realm';

class Result extends Realm.Object {}
Result.schema = {
    name: 'Result',
    primaryKey: 'id',
    properties: {
        id:'int',
        done: {type: 'bool', default: false},
        creationDate: 'date',
        total: 'int',
        notes: {type:'string', optional: true},
        points: {type:'list', objectType:'ResultItem'},
        type: 'string'
    },
};

class ResultItem extends Realm.Object {}
ResultItem.schema = {
    name: 'ResultItem',
    properties: {
        value: 'string'
    },
};


export default new Realm({schema: [ResultItem, Result]});