import Auth from './Auth.jsx';
import Profile from './Profile.jsx';


// Styling
import './App.css';

import { isAuthenticated } from '../util/auth.js';

function  Home() {
  return (
    <div className="landing center-content">
      {isAuthenticated() ? <Profile/>: <Auth/>}  
    </div>
  )
}

export default Home;