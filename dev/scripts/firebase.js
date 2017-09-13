  import firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBJe1mHPVrrqURwzmMNv_qbtPeQJ6tP6v8",
    authDomain: "lookbook-28f7d.firebaseapp.com",
    databaseURL: "https://lookbook-28f7d.firebaseio.com",
    projectId: "lookbook-28f7d",
    storageBucket: "lookbook-28f7d.appspot.com",
    messagingSenderId: "306357107610"
  };
  
  firebase.initializeApp(config);

  const storage = firebase.storage();

  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();

  export default firebase;