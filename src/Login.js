import React from 'react';
import './App.css';
import axios from 'axios';
import { updateToken } from './Store.js';
import { Redirect } from 'react-router-dom';


class Login extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: "",
      password: "",
      loggedin: false,
      valid: true,
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
      }).catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          this.setState({ valid: false })
        } else if (error.response.status === 400) {
          this.setState({ valid: false })
     }
   })
  }

  render(){
    if (this.state.loggedin) {
      return <Redirect to="/todos" />
    }
    return(
      <>
        <form onSubmit={ this.formLogin }>
          <input type="email" name="email" value={ this.state.email } onChange={ this.onChange } /><br/>
          <input type="password" name="password" value={ this.state.password } onChange={ this.onChange } /><br/>
          <button type="submit">Login</button>
        </form>
        <h1>{ !this.state.valid ? "Error logging in" : "" }</h1>
      </>
    )
  }
}

export default Login;
