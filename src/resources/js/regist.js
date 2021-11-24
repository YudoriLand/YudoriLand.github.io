'use strict';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from './firebase_config.js';


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var yudoriCollection = db.collection("yudorirun");

export default class RankManager {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
    async getData() {
        const snapshot = await yudoriCollection.get();
        const array = snapshot.docs.map(doc => doc.data());
        // return snapshot.docs.map(doc => doc.data());
        await array.sort((a, b) => b.score - a.score);
        return array;
    }
    setData(){
        yudoriCollection.add({
            name : this.name,
            score : this.score
        })
        alert("랭킹 등록 완료");
    }

}
// var nickname = document.getElementById("nick-name").value;

// console.log(nickname);

// document.getElementById("submit").addEventListener('click', function(event){
//     event.preventDefault();



//     let name = document.getElementById("nickname");

//     if (name.value==""){
//         alert("none");
//     }
//     else {
//         db.collection("user").add({
//             nickname : name.value,
//             password : "1234"
//         })

        
//     }
// })