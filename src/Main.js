import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import defaultAvatar from './slike/default-avatar.jpg'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { formatRelative } from 'date-fns';
import SearchBar from './searchbar';
import fire from './fire'

const Main = ({handleLogout}) =>{
 
    const [f,setf]=useState('');
    const auth = firebase.auth();
    const firestore = firebase.firestore();

    const { email, uid, displayName, photoURL } = auth.currentUser;

    var frend = firebase.firestore().collection("users")
    frend = frend.where("email", "!=", email);
    const [prijatelji]=useCollectionData(frend, { idField: 'id' });
    function ChatRoom() {
    var rom = f;
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');

    var query = firebase.firestore().collection("messages")
    query = query.where("room", "==", rom);
    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
    
    
    if(messages){  
    messages.sort((a,b)=>a.createdAt>b.createdAt ? 1 : -1);
  }

    else{};

    const sendMessage = async (e) => {
      e.preventDefault();
  
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        displayName,
        email,
        room: rom   
      })
  
      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  
    return (<>
    {rom?(<>
      <div className="chat-input txt2">{rom}</div>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input className="imput-poruka" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Napiši nešto..." />
        <button className="posalji" type="submit" disabled={!formValue}>🕊️</button>
      </form>
      </>):(<>
      
      <h1 className="emptyChattxt">NAPRAVITE ILI ODABERITE ČET DA BI ZAPOČELI ĆASKANJE</h1>
      </>)}
    </>)
  }

  



    function Rooms() {

    const dummy = useRef();
    const { uid, displayName} = auth.currentUser;
    const roomsRef = firestore.collection('rooms');
    const member2Ref = firestore.collection('members');
    const query = member2Ref.where("username", "==", displayName||email);
  
    const [rooms] = useCollectionData(query, { idField: 'id' });
   
    const [roomsValue, setRoomsValue] = useState('');
    
    const check = roomsRef.where("roomName", "==", roomsValue);
    const [cek]= useCollectionData(check, { idField: 'id' });
    const [roomError, setRoomError] = useState('');

    const memberRef = firestore.collection('members');

    const createRoom = async (e) => {
      e.preventDefault();

      

    if(cek<1){

      await memberRef.add({

        room: roomsValue,
        username: displayName || email
      })
      
      await roomsRef.add({

        roomName: roomsValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid
      })
      setRoomError('');
      setRoomsValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }else{
      var err= "Ovaj čet već postoji";
      setRoomError(err);
    }
    }
    return (<>
      <form onSubmit={createRoom}>
        <input className="chat-input" value={roomsValue} onChange={(e) => setRoomsValue(e.target.value)} placeholder="Novi čet..." />
        <button className="dodaj" type="submit" disabled={!roomsValue}>NOVI</button>
        <p className="errorMsg msg">{roomError}</p>
      </form>
      <form>
      <main className="lista">
    
        {rooms && rooms.map(room => 
        <button onClick={()=>setf(room.room)} className="rooms">
        <p className="">
          {room.room}   
        </p>
        <br/>
      </button>)}
        <span ref={dummy}></span>
      </main>
      </form>
    </>) 
  }

  const formatDate = date => {
    let formattedDate = '';
    if (date) {
      formattedDate = formatRelative(date, new Date());
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  };
  
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError]= useState('');
  
  

   
    

  


  function ChatMessage(props) {
    const { text, uid, photoURL,displayName,email, createdAt } = props.message;
  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <img className="slicica" src={photoURL || defaultAvatar} alt="slikica"/>
        <p className="poruka">

          <p className="username">{displayName || email}</p>
          {text}
          {createdAt?.seconds ?(
          <p className="username timestamp">{formatDate(new Date(createdAt.seconds * 1000))}</p>
          ): null}
          </p>
        <br/>
      </div>
    </>)
  } 

  var userexist = firebase.firestore().collection("users");
  userexist = userexist.where("email", "==", email);
  const [cek]= useCollectionData(userexist, { idField: 'id' });

  if(cek<1){
 
      const userRef = firebase.firestore().collection('users');
      
      const loginfinish = async (e) => {
        e.preventDefault();

        const update = {
          displayName: userName
        };
        
        await firebase.auth().currentUser.updateProfile(update);

        userRef.add({
  
          displayName: displayName||userName,
          email: email,
          photoURL: photoURL || defaultAvatar
        })
      }  
    
    return(<>
        {displayName?(<><form onSubmit={loginfinish}>
        <div>
        <h1 className="dobrodosli">DOBRO DOŠLI {displayName}</h1>
        <br/>
        <button className="dobrodoslibtn" type="submit">KLIK</button>
        <div className="klikni">Klikni na dugme da započnes</div>
        </div>
        </form></>):(<><form onSubmit={loginfinish}>
        <div>
        <h1 className="dobrodosli">DOBRO DOŠLI</h1>
        <br/>
        <input type="text" className="dodajkorisnika"autoFocus required value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Korisnicko ime"/>
                <p className="errorMsg">{userNameError}</p>
        <button className="dobrodoslibtn" type="submit">KLIK</button>
        <div className="klikni">Klikni na dugme da započnes</div>
        </div>
        </form></>)}
        
        
    </>)
    
  
}else{
  return(
    <div>
    <div className="nav-bar">
        <div className="displejime">{displayName}</div>
        <div className="logout-tab" onClick={handleLogout}>Logout</div>     
    </div>
    <div className="chat-pozadina">
        <div className="chatovi">
        <Rooms/>
        </div>
        <div className="chat">
           <ChatRoom/>
        </div>
        <div className="clanovi">    
        {f?(<><div className="chat-input txt2">ČLANOVI</div>
          <SearchBar placeholder="Pronađite prijatelje.." data={prijatelji} f={f} /></>):(<></>)}  
          
        </div>
        </div>  
    </div>
   )

}

//}
    
}
export default Main;


