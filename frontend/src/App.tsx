import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { getDoc } from './api/ServerData';

function App() {
  const [doc, setDoc] = useState<String>();

  useEffect(()=> {
    getDoc().then((response: any)=>{
      setDoc(response.data)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  return (
    <div className="App">
      {doc}
    </div>
  );
}

export default App;
