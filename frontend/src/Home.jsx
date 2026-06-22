import Auth from './Auth.jsx';
import Profile from './Profile.jsx';
import { isAuthenticated } from '../util/auth.js';
import './Home.css';

function Home() {
  const redirectBase =
        import.meta.env.MODE === "production" ? PROD_BASE_URL : BASE_URL
  console.log(redirectBase)
  
  return (
      <div className="content center-content">
        {isAuthenticated() ? <Profile/>: <Auth/>}
      </div>
  )
}

export default Home;