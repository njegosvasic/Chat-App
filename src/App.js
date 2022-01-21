import React, {useState, useEffect} from "react";
import fire from './fire';
import Login from './Login';
import './App.css';
import 'firebase/firestore';
import 'firebase/auth';
import Main from "./Main";


function App() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin = () => {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) =>{
        switch (err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;   
        }
      });
  };
  

  const handleSignup = () => {
    clearErrors();

    if(userName){
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        return result.user.updateProfile({
          displayName: userName
        });
      })
      .catch((err) =>{
        switch (err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
    }else if(!userName){
      var eror= "Niste uneli korisničko ime";
      setUserNameError(eror);
      
    };
  };


  

const handleLogout = () => {
  
  fire.auth().signOut();
};

const authListener = () => {
  fire.auth().onAuthStateChanged((user) => {
    if(user){
      clearInputs();
      setUser(user);

    }else{
      setUser("");
    }
  });
};

useEffect(() => {
  authListener();
}, []);


  

 return (
    <div className="App">
      {user ? (
        <Main handleLogout={handleLogout}/>
      ):(
        <Login 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        hasAccount={hasAccount}
        setHasAccount={setHasAccount}
        emailError={emailError}
        passwordError={passwordError}
        userName={userName}
        setUserName={setUserName}
        userNameError={userNameError}
        setUserNameError={setUserNameError}

        />
      )}
    </div>
  );
};


export default App;
