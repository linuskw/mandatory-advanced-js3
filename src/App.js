import React from 'react';
import './App.css';
import Login from './Login.js';
import Register from './Register.js';
import Todos from './Todos.js';
import axios from 'axios';
import { token$ } from './Store.js';
import jwt from 'jsonwebtoken';
import { Link, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';


class App extends React.Component {

  render(){
    return(
      <>
      <Router>
              <Route exact path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/todos" component={Todos} />
      </Router>
      </>
    )
  }
}

export default App;
