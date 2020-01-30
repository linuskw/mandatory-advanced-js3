import React from 'react';
import './App.css';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { token$, updateToken } from './Store.js';
import jwt from 'jsonwebtoken';


class Register extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: "",
      emailLoggedIn: "",
      password: "",
      registered: false,
      valid: true,
    }

    this.onChange = this.onChange.bind(this);
    this.formRegister = this.formRegister.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount(){
    axios.get('http://3.120.96.16:3002/todos', {
      headers: {
        Authorization: 'Bearer ' + token$.value,
      },
    })
    .then((response) => {
      console.log(response);
      this.setState({ todoArray: response.data.todos })
      const decoded = jwt.decode(token$.value);
      console.log(decoded);
      this.setState({ emailLoggedIn: decoded.email })
    }).catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        this.setState({ load: false })
      } else if (error.response.status === 400) {
        this.setState({ load: false })
      }
    })
  }

  onChange(e){
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    })
  }

  formRegister(e){
    e.preventDefault();
    axios.post('http://3.120.96.16:3002/register', {
      email: this.state.email,
      password: this.state.password
     })
    .then((response) => {
      this.setState({ emailComplete: this.state.email })
      console.log(response);

       axios.post('http://3.120.96.16:3002/auth', {
         email: this.state.email,
         password: this.state.password,
       })
         .then((response) => {
           console.log(response);
           updateToken(response.data.token);
           this.setState({ registered: true });
         }).catch((error) => {
           console.log(error);
           if (error.response.status === 401) {
             this.setState({ valid: false })
           } else if (error.response.status === 400) {
             this.setState({ valid: false })
        }
      })
     }).catch((error) => {
       console.log(error);
       if (error.response.status === 401) {
         this.setState({ valid: false })
       } else if (error.response.status === 400) {
         this.setState({ valid: false })
    }
  })
  }

  logOut(){
    console.log("logout");
    updateToken("");
    localStorage.removeItem('token')
    this.setState({ loggedout: true })
  }

  render(){
    if (this.state.registered) {
      return <Redirect to="/todos" />
    }
    return(
      <>
      <header>
        <h1>Register</h1>
        <h2>{ this.state.emailLoggedIn }</h2>
        <Link to={ '/login' }><button >Login</button></Link>
        <Link to={ '/register' }><button >Register</button></Link>
        <Link to={ '/todos' }><button >Todo list</button></Link>
        <Link to={ '/login' }><button onClick={ this.logOut }>Logout</button></Link>
      </header>
        <form onSubmit={ this.formRegister }>
          <input type="email" name="email" value={ this.state.email } onChange={ this.onChange } /><br/>
          <input type="password" name="password" value={ this.state.password } onChange={ this.onChange } /><br/>
          <button type="submit">Register</button>
        </form>
        <h1>{ !this.state.valid ? "Error when registering" : "" }</h1>
      </>
    )
  }
}

export default Register;
