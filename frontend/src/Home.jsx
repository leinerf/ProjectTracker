import Auth from './Auth.jsx';
import Profile from './Profile.jsx';
import { isAuthenticated } from '../util/auth.js';
import './Home.css';

function Home() {
  
  return (
      <div className="content center-content">
        {isAuthenticated() ? <Profile/>: <Auth/>}
      </div>
  )
}

export default Home;