import React, { useEffect, useState } from 'react';
import { LoginButton, SignUpButton } from '../components/CustomButton';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/pages/Login.css';

const Login = () => {

  useEffect(() => {
    document.title = 'Login';
  })

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChangeHandler = (event) => {
    event.target.name === 'username' ? setUsername(event.target.value) : setPassword(event.target.value);
  }

  const validationCheck = () => {

  }

  const login = (event) => {
    event.preventDefault();
  }

  const signUp = (event) => {
    // event.preventDefault();
  }

  return (
    <div className="login">
      <div className="login-form-container">
        <div className="login-form">
          <h2>Login!</h2>
          <h1 style={{padding: '20px 0'}}>CalEvents</h1>
         	<form action="auth" method="POST">
         		<input type="text" name="username" placeholder="Username" onChange={onChangeHandler} required />
         		<input type="password" name="password" placeholder="Password" onChange={onChangeHandler} required /><br /><br />
            <Link to='/resetpassword' className="reset-password">Forget Password?</Link><br /><br />
         		<LoginButton type="submit" onClick={login} content='Sign In' />
         	</form>
        </div>
        <div className="login-overlay">
            <h1>Join Us!</h1>
            <h6>
              CalEvents can help you manage your schedules well!
            </h6>
            <SignUpButton type="" onClick={signUp} content='Sign Up' />
        </div>
      </div>
    </div>

    // <div className="login-form">
		// 	<h1>Welcome!</h1>
		// </div>
  )
}

export default Login