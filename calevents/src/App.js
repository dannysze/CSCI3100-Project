// The App component of CalEvents which routes different links
import React from 'react';
import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MyCalendar from './pages/MyCalendar';
import SearchPage from './pages/SearchPage';
import Events from './components/Event/Events';
import './styles/App.css';
import useToken from './useToken';
import ProtectedRoute from './ProtectedRoute';
import User from './pages/User';
// import JoinEvent from './pages/JoinEvent';
import {UserContext} from  './UserContext';
import getaddr from './components/getaddr';
import ResetPassword from './pages/ResetPassword';

function App() {
 
  const defaultUser = 
  {
    type:0,
    user_id:0,
    username:"",
    email:"",
    img_loc:"",
    account_balance:"",
  }
  const [user,setUser] = useState(defaultUser);
  const {token,setToken} = useToken();

  const getUser = async () => {
    try{
      //change getaddr() to getaddr(isLocal=false) to make it use remote address
      //basically passing the token by the header
      let res = await fetch(getaddr()+'user', {
        method: 'GET',
        headers: {
          'auth': token,
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({token:token}),
      });
      let body = await res.json();
      setUser(body);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    getUser();
  },[]);

  return (
    <div className="App">
      {/* Route page with different address */}
      <Router>
        {/* Protected route requires authentication */}
        <UserContext.Provider value={{user,setUser}}>
          <Route path="/login" exact component={Login} />
          <ProtectedRoute path="/" exact component={Home} />
          <ProtectedRoute path="/events" exact component={Events}/>
          <ProtectedRoute path="/myCalendar" exact component={MyCalendar} />
          <ProtectedRoute path="/search" exact component={SearchPage} />

          {/*The following links are for functional illustration purpose */}
          <ProtectedRoute path="/user" exact component={User} />
          {/* <ProtectedRoute path="/joinEvent" exact component={JoinEvent} /> */}
          
        </UserContext.Provider>
        <Route path="/reset_password" component={ResetPassword}></Route>
      </Router>
    </div>
  );
}

export default App;
