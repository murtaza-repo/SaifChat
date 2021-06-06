import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyDMko_ErTsSWCROUbuQIXK1p8t6fPGmoHU",
    authDomain: "react-slack-clone53.firebaseapp.com",
    projectId: "react-slack-clone53",
    storageBucket: "react-slack-clone53.appspot.com",
    messagingSenderId: "685269504343",
    appId: "1:685269504343:web:74bf84b58fbc2773172e12",
    measurementId: "G-Y15QQESCE0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;