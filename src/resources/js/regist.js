'use strict';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from './firebase_config.js';


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var yudoriCollection = db.collection("yudorirun");

export default class RankManager {
    constructor() {
    }
    async getData() {
        const snapshot = await yudoriCollection.get();
        const array = snapshot.docs.map(doc => doc.data());
        // return snapshot.docs.map(doc => doc.data());
        await array.sort((a, b) => b.score - a.score);
        return array;
    }
    static setData(_name, _score){
        yudoriCollection.add({
            name : _name,
            score : _score
        })
        alert("랭킹 등록 완료");
    }

}