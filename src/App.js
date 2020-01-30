import React from 'react';
import './App.css';
import Login from './Login.js';
import Register from './Register.js';
import Todos from './Todos.js';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';


class App extends React.Component {
  constructor(props){
    super(props)
  }


  render(){
    return(
      <Router>
        <Link to="/">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/todos">Todos</Link>
        <Route exact path="/" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/todos" component={Todos} />
      </Router>
    )
  }
}

export default App;
