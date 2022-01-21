import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBkrQtGUboGVJV3zi81sM7kooJvM9XX_ZY",
    authDomain: "login-13c36.firebaseapp.com",
    projectId: "login-13c36",
    storageBucket: "login-13c36.appspot.com",
    messagingSenderId: "674834281739",
    appId: "1:674834281739:web:5cedeafd66643595665e0e"
  };

 const fire = firebase.initializeApp(firebaseConfig);

 export default fire;