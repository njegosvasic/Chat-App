import React from 'react';
import { githubProvider, googleProvider } from './config/authMethods';
import socialMediaAuth from './service/auth';
import 'firebase/auth';

const handleOnClick = async(provider) =>{
    const res = await socialMediaAuth(provider);
  };
  
const Login = (props) => {
    
    const {
        email, 
        setEmail, 
        password, 
        setPassword, 
        handleLogin, 
        handleSignup, 
        hasAccount, 
        setHasAccount, 
        emailError, 
        passwordError,
        userName,
        setUserName,
        userNameError
    
    } = props;

   return (
        <div className="base-container">
          <div className="login-page">
          <div className="form">
            <div className="login-form">
                {hasAccount ?(<></>):(<><input type="text" autoFocus required value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Korisnicko ime"/>
                <p className="errorMsg">{userNameError}</p></>)}
                 
                <input type="text" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Mejl"/>
                <p className="errorMsg">{emailError}</p>
                <input type="password" autoFocus required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Šifra"/>
                <p className="errorMsg">{passwordError}</p>

              
                    {hasAccount ? (
                        <>
                        <div className="btnContainer">
                        <button onClick={handleLogin}>Uloguj se</button>  
                        <div class="helper">Prijavite se preko drugih naloga?</div>
                        <button onClick={()=>handleOnClick(githubProvider)}>Github</button>
                        <button onClick={()=>handleOnClick(googleProvider)}>Google</button>
                        <p>Niste registrovani ? <span onClick={() => setHasAccount(!hasAccount)}>Kreirajte nalog</span></p>
                        </div>
                        </>
                    ):(
                        <>
                        <div className="btnContainer">
                        <button onClick={handleSignup}>Registruj se</button>
                        <p>Već imate nalog ? <span onClick={() => setHasAccount(!hasAccount)}>Prijavite se</span></p>
                        </div>
                        </>

                    )}
                </div>
            </div>
          </div>
         </div>
        
          
    )

}

export default Login;