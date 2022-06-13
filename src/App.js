import React, { useState } from "react";
import './App.css';
import {initializeApp}from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, query, orderBy, limit, serverTimestamp, getFirestore } from "firebase/firestore"; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore'

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

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1> Super Chat 😎</h1>
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
    </>
  )
}

function ChatRoom(){
  const db = getFirestore(app);
  const MessagesRef = collection(db,"messages");
  const MsgQuery = query(MessagesRef,orderBy("createdAt"),limit(25));
  const [messages] = useCollectionData(MsgQuery,{idField:"id"});
  const [formValue, setFormValue] = useState("");
  const postMsg = async (e) =>{
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await addDoc(MessagesRef,{
      text:formValue,
      createdAt:serverTimestamp(),
      uid,
      photoURL
    })
  }
  return(
    <>
      {messages && messages.map(msg => <Post key={msg.id} message={msg} />)}
      <form onSubmit={postMsg}>
        <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} placeholder="Whats Happening"/>
        <button type="submit" disabled={!formValue}>Post</button>
      </form>
    </>
  )
}

function Post(props){
  const {text, photoURL} = props.message;
  return(
    <div className="message">
      <img src={photoURL} alt="User"/>
      <p> {text} </p>
    </div>
  )
}

export default App;
