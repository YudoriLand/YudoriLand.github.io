// 'use strict';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import firebaseConfig from '../firebase_config.js';



// firebase.initializeApp(firebaseConfig);
// console.log(firebaseConfig);

// var uid = document.getElementById("uid").value;
// var obj = document.getElementById("obj");

// const db = firebase.firestore();
// console.log(db);
// var user = db.collection("user");

// console.log(uid);
// console.log(obj);

// document.getElementById("submit").addEventListener('click', function(event){
//     event.preventDefault();


//     let name = document.getElementById("uid");

//     if (name.value==""){
//         alert("none");
//     }
//     else {
//         db.collection("user").add({
//             nickname : name.value,
//             password : "1234"
//         })

//         alert("data push");
//     }
// })