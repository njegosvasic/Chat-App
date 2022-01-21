import React, { useState, useRef } from "react";
import "./App.css";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


function SearchBar({ placeholder, data, f}) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  
 // const {displayName, photoURL} = firebase.auth().currentUser; 

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.displayName.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };
    const [member,setMember] = useState('');

    const dummy = useRef();
    const firestore = firebase.firestore();
    const memberRef = firestore.collection('members');
    
    var check = memberRef.where("username", "==", member).where("room","==",f);
    
    const [cek] = useCollectionData(check, { idField: 'id' });

    const uclani = async (e) => {
        e.preventDefault();

        if(cek<1){
      
        await memberRef.add({
          username: member,
          room: f   
        })
        setMember('');
        
        dummy.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    var query1 = firebase.firestore().collection("members");
    query1 = query1.where("room", "==", f)/*.where("username","!=", displayName)*/;
    
    const [allMembers] = useCollectionData(query1, { idField: 'id' });

  return (<>
  <main className="">
    <form onSubmit={uclani}>
    <div className="inputtypetext">
      <div className="">
        <input className="prijateljinput"
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <button className="dataItem" type="submit" onClick={()=>setMember(value.displayName)} target="_blank">
                <p>{value.displayName} </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
    </form>
    
    
        {allMembers && allMembers.map(membr => 
        <div className="dataItem">
        <p className="">
          {membr.username}   
        </p>
        <br/>
      </div>)}
        <span ref={dummy}></span>
      </main>
    
    </> );
}

export default SearchBar;