// Login page component
import React, { useEffect, useState } from 'react';
import { LoginButton, SignUpButton, CloseButton } from '../components/CustomButton';
import { CSSTransition } from 'react-transition-group';
import getaddr from '../components/getaddr'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/pages/Login.css';
import useToken from '../useToken'

// Main component
const Login = () => {
  const {token, setToken} = useToken();

  // change the doc title depending on the current page
  useEffect(() => {
    document.title = showSignUp ? 'Login' : 'Sign Up';
  })

  // used for simple validation check (format)
  var checkValid = {
    'username': true,
    'password': true,
    'password_double': true,
    'email': true,
  }

  // error messgae shown under the fields which failed the validation check
  var defaultResult = {
    'errorMsg':'',
    'alert':false,
  }

  // initialize form value
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [showSignUp, setShowSignUp] = useState(true);
  const [valid, setValid] = useState(checkValid);
  const [resetPassword, setResetPassword] = useState(false);
  const [loginResult, setLoginResult] = useState(defaultResult);
  const [signupResult, setSignupResult] = useState(defaultResult);
  const [resetResult, setResetResult] = useState(defaultResult);

  // login form change handler
  const loginChangeHandler = (event) => {
    event.target.name === 'username' ? setUsername(event.target.value) : setPassword(event.target.value);
    setLoginResult(defaultResult);
  }


  const signUpChangeHandler = (event) => {
    setSignupResult(defaultResult);
    if (event.target.name === 'username_register') {
      setUsername(event.target.value);
    } else if (event.target.name === 'password_register') {
      setPassword(event.target.value);
      password === event.target.value ? setValid({ ...checkValid, 'password_double': true }) : setValid({ ...checkValid, 'password_double': false })
    } else if (event.target.name === 'password_register_check') {
      // double check the password
      password === event.target.value ? setValid({ ...checkValid, 'password_double': true }) : setValid({ ...checkValid, 'password_double': false })
    } else if (event.target.name === 'email_register') {
      // email checking needed
      let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      regEmail.test(email) ? setValid({ ...checkValid, 'email': true }) : setValid({ ...checkValid, 'email': false })
      setEmail(event.target.value);
    } else if (event.target.name === 'type') {
      setUserType(event.target.value);
    }
  }

  // click handler for the reset button on the sign up page (erase the whole form)
  const resetChangeHandler = (event) => {
    event.preventDefault();
    setResetResult(defaultResult);
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      regEmail.test(email) ? setValid({ ...checkValid, 'email': true }) : setValid({ ...checkValid, 'email': false })
      setEmail(event.target.value);
  }

  // click event for transit to the reset password form and clear the sign in and sign up form
  const resetPasswordHandler = (event) => {
    event.preventDefault();
    clearForm();
    setResetPassword(!resetPassword);
  }

  // Login submit handler
  const login = async (event) => {
    event.preventDefault();
    if(!username||!password){
      setLoginResult({'errorMsg':'Neither username nor password should be left empty', 'alert':true});
      return;
    }
    try{
      //change getaddr() to getaddr(isLocal=false) to make it use remote address
      let res = await fetch(getaddr()+'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username:username, password:password}),
      });
      let body = await res.json();
      if (!res.ok){
            setLoginResult({'errorMsg':body['error'], 'alert':true});
      }else{
        //temporily use user_id as token
        setToken({'token':body['token']});
        window.location.replace("/");
      }
    }catch(err){
      console.log(err);
    }
  }

  // sign up submit handler
  const signup = async (event) => {
    event.preventDefault();
    if(!username||!password||!email){
      setSignupResult({'errorMsg':'No fields should be left empty', 'alert':true});
      return;
    }
    if(!userType){
      setSignupResult({'errorMsg':'Please select user type', 'alert':true});
      return;
    }
    if(!valid.username||!valid.password||!valid.email){
      return;
    }
    try{
      let res = await fetch(getaddr()+'signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username:username, password:password,email:email,type:(userType=='user'?0:1)}),
      });
      let body = await res.json();
      if (!res.ok){
            setSignupResult({'errorMsg':body['error'], 'alert':true});
      }else{
        setToken({'token':body['token']});
        window.location.replace("/");
      }
    }catch(err){
      console.log(err);
    }
  }

  // reset password submit handler
  const resetpassword = async event => {
    event.preventDefault();
    if(!email){
      setResetResult({'errorMsg':'Email should not be left empty', 'alert':true});
      return;
    }
    if(!valid.email){
      return;
    }
    try{
      let res = await fetch(getaddr()+'reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email}),
      });
      let body = await res.json();
      if (!res.ok){
            setResetResult({'errorMsg':body['error'], 'alert':true});
      }else{
        setResetResult({'errorMsg':'Password reset link has been sent to your mailbox. Reset your password there.', 'alert':true});
      }

    }catch(err){
      console.log(err);
    }
  }

  const forms = document.getElementsByTagName('form'); 
  // clear all input in the form and state
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
  
  // sign up form input fields
  const signUpFields = [{ 
    'name': 'username_register',
    'placeholder': 'Username',
    'type': 'text',
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
  
  // sign in form input fields
  const signInFields = [{
    'name': 'username',
    'placeholder': 'Username',
    'type': 'text',
  }, {
    'name': 'password',
    'placeholder': 'Password',
    'type': 'password',
  }]
  
  // page gradient overlay transition state
  const move = () => {
    clearForm();
    setResetPassword(false);
    setShowSignUp(!showSignUp);
    setLoginResult(defaultResult);
    setSignupResult(defaultResult);
    setResetResult(defaultResult);
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
          {/* Gradient overlay with css transition */}
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
          {/* SIgn up form */}
          <div className="signup-form">
            <h2>Sign Up</h2>
            <form action="auth" nethod="POST">
              {signUpFields.map((item, index) => (
                <>
                  <input type={item.type} name={item.name} placeholder={item.placeholder} onChange={signUpChangeHandler} key={index} required/>
                  {<div className="alert-box" style={item.alert ? {visibility: 'hidden'} : {visibility: 'visible'}}>{item.errorMsg}</div>}
                </>
                ))}
              {<div className="alert-box" style={signupResult.alert ? {visibility: 'visible'} : {visibility: 'hidden'}}>{signupResult.errorMsg}</div>}
              <div className="note">Note<span style={{color: 'red'}}> * </span>: Users cannot create public events. Organisers cannot join events</div>
              <div className="radio-group">
                <label className="radio-container">
                  <input type="radio" name="type" value="user" onChange={signUpChangeHandler}/>User
                  <span className="checkmark"></span>
                </label>
                <label className="radio-container">
                  <input type="radio" name="type" value="organiser" onChange={signUpChangeHandler}/>Organiser
                  <span className="checkmark"></span>
                </label>
              </div><br />
              <LoginButton type="submit" onClick={signup} content='Sign up' />
            </form>
          </div>
          {/* sign in form with css transition */}
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
                {<div className="alert-box" style={loginResult.alert ? {visibility: 'visible'} : {visibility: 'hidden'}}>{loginResult.errorMsg}</div>}
                <br /><br />
                <a onClick={resetPasswordHandler} className="reset-password">Forget Password?</a><br /><br />
                <LoginButton type="submit" onClick={login} content='Sign In' />
              </form>
            </div>
          </CSSTransition>
          {/* password reset form with css transition */}
          <CSSTransition
            in={resetPassword}
            timeout={800}
            classNames="reset-form"
          >
            <div className="reset-form">
              <CloseButton onClick={resetPasswordHandler} style={{marginLeft: '10%', marginTop: '-20%'}}/>
              <h2>Reset Password</h2>
              <form action="auth" method="POST">
                <input type="text" name="email" placeholder="Enter your email" onChange={resetChangeHandler}/>
                {<div className="alert-box" style={!valid.email ? {visibility: 'visible'} : {visibility: 'hidden'}}>Not valid email address</div>}
                {<div className="alert-box" style={resetResult.alert ? {visibility: 'visible'} : {visibility: 'hidden'}}>{resetResult.errorMsg}</div>}
                <br /><br />
                <LoginButton type="submit" onClick={resetpassword} content='Reset password' />
              </form>
            </div>
          </CSSTransition>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Login
