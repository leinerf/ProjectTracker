import Button from 'react-bootstrap/Button';
import { signInGoogleAuth } from '../util/auth.js';
import './Auth.css';
function Auth() {  

  return (
    <div className="md-container center-content">
      <h1 className="header">Project Tracker</h1>
      <p className="description">
        Welcome to Project Tracker, your all-in-one solution for managing and tracking your projects. With Project Tracker, you can easily measure how much time you spend on each project, set goals, and stay organized. Whether you're a freelancer, a student, or part of a team, Project Tracker helps you stay on top of your work and achieve your goals efficiently.
      </p>
      <div className="buttons-container">
        <Button variant="dark" className="align-icon" onClick={() => {signInGoogleAuth('google-signup')}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"></path>
          </svg>
          <span>Sign Up</span>
        </Button>
        <Button variant="outline-dark" className="align-icon" onClick={() => {signInGoogleAuth('google-signin')}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"></path>
          </svg>
          <span>Login</span>
        </Button>
      </div>
    </div>
  );
}

export default Auth;