import React from 'react';
import axios from 'axios'
//Components
import Auth from './Auth';
import Profile from './Profile';


// Styling
import './App.css';

import { isAuthenticated } from '../util/auth.js';

function  App() {
  return (  
    <div className="landing center-content">
      {isAuthenticated() ? <Profile/>: <Auth/>}  
    </div>
  )
}

export default App;