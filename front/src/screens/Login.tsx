
//import {useHistory} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import "../App.css";
import getEnvironment from '../environment'
import {CircularProgress} from '@material-ui/core';
import axios from 'axios';
import {
  useNavigate 
} from "react-router-dom";

export default function Login(props: any) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    if (status!='idle') {
      return;
    }
    setStatus('busy');
    let env=getEnvironment();
    axios.post(env.api+'/login',{id, password}).then(res=>{
      props.setToken(res.data.access_token);
      setStatus('idle');
      navigate('/videos');
    }).catch(err=>{
      alert(err);
      setStatus('idle');
    })
  };
  const handleRegister = () => {
    if (status!='idle') {
      return;
    }
    setStatus('busy');
    let env=getEnvironment();
    axios.post(env.api+'/user',{id, password}).then(res=>{
      props.setToken(res.data.access_token);
      setStatus('idle');
      navigate('/videos');
    }).catch(err=>{
      alert(err);
      setStatus('idle');
    })
  };

  return (
    
    <main style={{ padding: 0 }}>
      <CircularProgress style={{display:status==='busy'?'':'none'}} />
      <div className="App">
        <form className="form" onSubmit={() => handleLogin()}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="name@email.com" onChange={e=>setId(e.target.value)}/>
        </div>
        <div className="input-group">
          <label htmlFor="password" >Password</label>
          <input type="password" name="password" onChange={e=>setPassword(e.target.value)}/>
        </div>
      </form>
      <button className="secondary" onClick={() => handleLogin()}>
        Login
      </button>
    </div><br /><button onClick={() => handleRegister()} className="primary">
        Register
      </button>
    </main>
  );
}