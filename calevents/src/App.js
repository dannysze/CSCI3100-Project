import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MyCalendar from './pages/MyCalendar';
import SearchPage from './pages/SearchPage';
import Events from './components/Event/Events';
import './styles/App.css';
import useToken from './useToken';
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/login" exact component={Login} />
        <ProtectedRoute path="/" exact component={Home} />
        <ProtectedRoute path="/events" exact component={Events}/>
        <ProtectedRoute path="/myCalendar" exact component={MyCalendar} />
        <ProtectedRoute path="/search" exact component={SearchPage} />
      </Router>
    </div>
  );
}

export default App;
