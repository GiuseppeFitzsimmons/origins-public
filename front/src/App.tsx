import React, {useEffect, useState} from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  useLocation,
  Routes 
} from "react-router-dom";
import Login from './screens/Login';
import Videos from './screens/Videos';

function App() {
  const [token, setToken] = useState('');
  return (
    
    <div className="App">
<Router>
  <Routes>
            <Route path="/" element={<Login setToken={setToken}/>}/>
            <Route path="/login" element={<Login setToken={setToken}/>}/>
            <Route path="/videos" element={<Videos token={token}/>}/>
    </Routes>
    </Router>
    </div>
  );
}

export default App;
