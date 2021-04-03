import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MyCalendar from './pages/MyCalendar';
import SearchPage from './pages/SearchPage';
import Events from './components/Event/Events';
import './styles/App.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/events" exact component={Events}/>
        <Route path="/myCalendar" exact component={MyCalendar} />
        <Route path="/search" exact component={SearchPage} />
      </Router>
    </div>
  );
}

export default App;
