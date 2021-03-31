import React, { useEffect, useState } from 'react';
import { LoginButton, SignUpButton, CloseButton } from '../components/CustomButton';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/pages/Login.css';

const Login = () => {

  useEffect(() => {
    document.title = showSignUp ? 'Login' : 'Sign Up';
  })

  var checkValid = {
    'username': true,
    'password': true,
    'password_double': true,
    'email': true,
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [showSignUp, setShowSignUp] = useState(true);
  const [valid, setValid] = useState(checkValid);
  const [resetPassword, setResetPassword] = useState(false);

  const loginChangeHandler = (event) => {
    event.target.name === 'username' ? setUsername(event.target.value) : setPassword(event.target.value);
  }

  const signUpChangeHandler = (event) => {
    if (event.target.name === 'username_register') {
      setUsername(event.target.value);
    } else if (event.target.name === 'password_register') {
      setPassword(event.target.value);
    } else if (event.target.name === 'password_register_check') {
      // double check the password
      password === event.target.value ? setValid({ ...checkValid, 'password_double': true }) : setValid({ ...checkValid, 'password_double': false })
    } else if (event.target.name === 'email') {
      // email checking needed
      setEmail(event.target.value);
    } else if (event.target.name === 'type') {
      setUserType(event.target.value);
    }
  }

  const resetPasswordHandler = (event) => {
    event.preventDefault();
    clearForm();
    setResetPassword(!resetPassword);
  }

  const validationCheck = () => {

  }

  const login = (event) => {
    event.preventDefault();
  }

  const signup = (event) => {
    event.preventDefault();
  }

  const forms = document.getElementsByTagName('form'); //

  const clearForm = () => {
    setUsername('');
    setPassword('');
    for (let i = 0; i < forms.length; i++) {
      forms[i].reset();
    }
    setUsername('');
    setPassword('');
    setEmail('');
    setUserType('');
    setValid(checkValid);
  }
  
  const signUpFields = [{ 
    'name': 'username_register',
    'placeholder': 'Username',
    'type': 'text',
    // onBlurHandler: () => {checking if the username is used?}
    'errorMsg': 'The username has been used',
    'alert': valid.username
  }, { 
    'name': 'email_register',
    'placeholder': 'Email Address',
    'type': 'text',
    'errorMsg': 'Not valid email address',
    'alert': valid.email
  }, {
    'name': 'password_register',
    'placeholder': 'Password',
    'type': 'password',
    'errorMsg': '&nbsp;',
    'alert': valid.password
  }, {
    'name': 'password_register_check',
    'placeholder': 'Enter Password Again',
    'type': 'password',
    'errorMsg': 'Password is not matched',
    'alert': valid.password_double
  }]
  
  const signInFields = [{
    'name': 'username',
    'placeholder': 'Username',
    'type': 'text'
  }, {
    'name': 'password',
    'placeholder': 'Password',
    'type': 'password'
  }]
  
  const move = () => {
    clearForm();
    setResetPassword(false);
    setShowSignUp(!showSignUp);
  }

  return (
    <CSSTransition
      in={true}
      timeout={300}
      classNames="login-page"
      unmountOnExit
    >
      <div className="login flex-center">
        <div className="login-form-container">
          <CSSTransition
            in={!showSignUp}
            timeout={700}
            classNames="login-overlay"
            unmountOnExit={false}
          >
            <div className="login-overlay flex-center">
              <div className="login-show flex-center">
                <h1>Join Us!</h1>
                <h6>
                  CalEvents can help you manage your schedules well!
                </h6>
                <SignUpButton type="" onClick={move} content='Sign Up' />
              </div>
              <div className='signup-show flex-center'>
                <h1>Already have an account?</h1>
                <h6>
                  {/* CalEvents can help you manage your schedules well! */}
                </h6>
                <SignUpButton type="" onClick={move} content='Sign in' />
              </div>
            </div>
          </CSSTransition>
          <div className="signup-form">
            <h2>Sign Up</h2>
            <form action="auth" nethod="POST">
              {signUpFields.map((item, index) => (
                <>
                  <input type={item.type} name={item.name} placeholder={item.placeholder} onChange={signUpChangeHandler} key={index} required/>
                  {<div className="alert-box" style={item.alert ? {visibility: 'hidden'} : {visibility: 'visible'}}>{item.errorMsg}</div>}
                </>
                ))}
              <div className="note">Note<span style={{color: 'red'}}> * </span>: Users cannot create public events. Organisers cannot join events</div>
              <div className="radio-group">
                <label className="radio-container">
                  <input type="radio" name="type" value="user" />User
                  <span className="checkmark"></span>
                </label>
                <label className="radio-container">
                  <input type="radio" name="type" value="organiser" />Organiser
                  <span className="checkmark"></span>
                </label>
              </div><br />
              <LoginButton type="submit" onClick={signup} content='Sign up' />
            </form>
          </div>
          <CSSTransition
            in={!resetPassword}
            timeout={350}
            classNames="reset-login-form"
          >
            <div className="login-form">
              <h2>Login!</h2>
              <h1 style={{padding: '20px 0'}}>CalEvents</h1>
              <form action="auth" method="POST">
                {signInFields.map((item, index) => (<input type={item.type} name={item.name} placeholder={item.placeholder} onChange={loginChangeHandler} key={index} required/>))}
                <br /><br />
                <a onClick={resetPasswordHandler} className="reset-password">Forget Password?</a><br /><br />
                <LoginButton type="submit" onClick={login} content='Sign In' />
              </form>
            </div>
          </CSSTransition>
          <CSSTransition
            in={resetPassword}
            timeout={800}
            classNames="reset-form"
          >
            <div className="reset-form">
              <CloseButton onClick={resetPasswordHandler} style={{marginLeft: '10%', marginTop: '-20%'}}/>
              <h2>Reset Password</h2>
              <form action="auth" method="POST">
                <input type="text" name="email" placeholder="Enter your email" onChange={loginChangeHandler}/>
                <br /><br />
                <LoginButton type="submit" onClick={login} content='Reset password' />
              </form>
            </div>
          </CSSTransition>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Login
