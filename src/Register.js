import React from 'react';
import './App.css';
import axios from 'axios';
import { token$, updateToken } from './Store.js';
import { Redirect } from 'react-router-dom';


class Register extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: "",
      password: "",
      registered: false,
    }

    this.onChange = this.onChange.bind(this);
    this.formRegister = this.formRegister.bind(this);
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
      console.log(response);
      this.setState({
        registered: true,
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

  render(){
    if (this.state.registered) {
      return <Redirect to="/login" />
    }
    return(
      <>
        <form onSubmit={ this.formRegister }>
          <input type="email" name="email" value={ this.state.email } onChange={ this.onChange } /><br/>
          <input type="password" name="password" value={ this.state.password } onChange={ this.onChange } /><br/>
          <button type="submit">Register</button>
          </form>
      </>
    )
  }
}

export default Register;
