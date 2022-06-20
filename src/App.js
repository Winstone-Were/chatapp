import React, { useState, useEffect, useRef } from "react";
import './App.css';
import {initializeApp}from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { collection, addDoc, query, orderBy, limit, serverTimestamp, getFirestore, onSnapshot } from "firebase/firestore"; 
import { useAuthState } from 'react-firebase-hooks/auth';

import {Input, PinInput, PinInputField, Button, VStack, Flex} from "@chakra-ui/react"

const firebaseConfig = {
  apiKey: "AIzaSyDpPJRmnztU0lYrmVIeueftU4zmrb03O2E",
  authDomain: "learning-firebase-3e9bf.firebaseapp.com",
  databaseURL: "https://learning-firebase-3e9bf-default-rtdb.firebaseio.com",
  projectId: "learning-firebase-3e9bf",
  storageBucket: "learning-firebase-3e9bf.appspot.com",
  messagingSenderId: "186620720316",
  appId: "1:186620720316:web:826da82efb0e41f2118cb9",
  measurementId: "G-XQ6903Z8N1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

//Entry Point To Te App
function App() {
  const [user] = useAuthState(auth);
  const signOutFunction = ()=>{
    signOut(auth);
  }
  return (
    <div className="App">
      <header>
        <h1>Visit Gilo</h1>
        {user ? <p> Signed In As {auth.currentUser.displayName} </p>: <p>Sign In</p> }
        {user ? <Button  onClick={signOutFunction}> SignOut </Button> : <p> Visit Gilo</p>}
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){
  const SignInWithGoogle = ()=>{
    signInWithPopup(auth,provider);
  }
  return (
    <>
      <button className="sign-in" onClick={SignInWithGoogle}> Sign In With Google </button>
      <CreateChatRoom/>
    </>
  )
}

function ChatRoom(){
  const db = getFirestore(app);
  const MessagesRef = collection(db,"messages-new");
  
  const [formValue, setFormValue] = useState("");
  const postMsg = async (e) =>{
    e.preventDefault();
    const {uid,photoURL,displayName} = auth.currentUser;
    await addDoc(MessagesRef,{
      text:formValue,
      createdAt:serverTimestamp(),
      uid,
      photoURL,
      displayName
    })
    setFormValue(" ");
  }

  return(
    <>
      <PostsPage/>
      <form onSubmit={postMsg}>
        <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} placeholder="Whats Happening"/>
        <button type="submit" disabled={!formValue}>Post</button>
      </form>
    </>
  )
}

function Post(props){
  const {text, photoURL, uid, displayName} = props.message;
  return(
    <div>
      <div className={`msg ${uid === auth.currentUser.uid ? 'sent': 'received'}`}>
        <img src={photoURL} alt="User"/>
        <p> {text} </p>
    </div>
    </div>
  )
}

function PostsPage(){
  const db = getFirestore(app);
  const MessagesRef = collection(db,"messages-new");
  const MsgQuery = query(MessagesRef,orderBy("createdAt","desc"),limit(15)); 
  const  [posts, setPost] = useState([]);
  useEffect(()=>{
    onSnapshot(MsgQuery,(snapshot)=>{
      setPost(snapshot.docs.map(doc=> doc.data()));
    })
  },[])
  
  return(
    <div className="posts">
      {posts.map(pst=> <Post key={pst.id} message={pst}/>)}   
    </div>
  )
}

function CreateChatRoom(){
  const [valueName,setNameValue] = useState('');
  const [valuePin,setPinValue] = useState('');
  const handleChange = ()=>{
    console.log(`${valueName} : ${valuePin}`);
  }
  return(
    <VStack>
      <Input
        value={valueName}
        placeholder = "Sample Place Holder"
        onChange={(e)=> setNameValue(e.target.value)}
        variant='flushed'
      />
      <Flex>
        <PinInput onChange={(e)=> setPinValue(e)}>
          <PinInputField/>
          <PinInputField/>
          <PinInputField/>
          <PinInputField/>
        </PinInput>
      </Flex>
      <Button onClick={handleChange}> CREATE CHAT ROOM </Button>
    </VStack>
  )
}

function HomeArea(){
  
}

function ChatRooms(){
  //UseEffect Function That Runs To Get All The Registered Chat Rooms
  //Returns Buttons To Which When Clicked Allows User To Enter A Chat Room
}

export default App;
