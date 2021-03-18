import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/pages/login.css';

const Login = () => {

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

  return (
    <div class="login-form">
			<h1>Welcome!</h1>
			<form action="auth" method="POST">
				<input type="text" name="username" placeholder="Username" onChange={onChangeHandler} required />
				<input type="password" name="password" placeholder="Password" onChange={onChangeHandler} required />
				<input type="submit" value="Sign in" onClick={login} />
			</form>
		</div>
  )
}

export default Login