import React from 'react';
import './App.css';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { token$, updateToken } from './Store.js';
import { Redirect } from 'react-router-dom';


class Login extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: "",
      password: "",
      loggedin: false,
    }

    this.onChange = this.onChange.bind(this);
    this.formLogin = this.formLogin.bind(this);
  }

  onChange(e){
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    })
  }

  formLogin(e){
    e.preventDefault();
    axios.post('http://3.120.96.16:3002/auth', {
      email: this.state.email,
      password: this.state.password,
    })
      .then((response) => {
        console.log(response);
        updateToken(response.data.token);
        this.setState({ loggedin: true });
      })
  }

  render(){
    if (this.state.loggedin) {
      return <Redirect to="/todos" />
    }
    return(
      <form onSubmit={ this.formLogin }>
        <input type="email" name="email" value={ this.state.email } onChange={ this.onChange } /><br/>
        <input type="password" name="password" value={ this.state.password } onChange={ this.onChange } /><br/>
        <button type="submit">Login</button>
      </form>
    )
  }
}

export default Login;
