import Auth from './Auth.jsx';
import Profile from './Profile.jsx';
import { isAuthenticated } from '../util/auth.js';
import './Home.css';

function Home() {
  console.log(import.meta.env.MODE)
  console.log(PROD_BASE_URL)
  console.log(BASE_URL)
  return (
      <div className="content center-content">
        {isAuthenticated() ? <Profile/>: <Auth/>}
      </div>
  )
}

export default Home;