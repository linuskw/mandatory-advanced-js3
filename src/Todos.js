import React from 'react';
import './App.css';
import axios from 'axios';
import { token$, updateToken } from './Store.js';
import { Link, Redirect } from 'react-router-dom';
import jwt from 'jsonwebtoken';


class Todos extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: "",
      content: "",
      todoArray: [],
      load: true,
      submit: true,
      delete: true,
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onError = this.onError.bind(this);
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
      this.setState({ email: decoded.email })
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
    this.setState({ content: e.target.value })
  }

  onSubmit(e){
    e.preventDefault();
    axios.post('http://3.120.96.16:3002/todos', { content: this.state.content }, {
      headers: {
        Authorization: 'Bearer ' + token$.value,
      },
    })
    .then((response) => {
      console.log(response);
      console.log("success");
      this.componentDidMount();
      this.setState({ content: "" })
    }).catch((error) => {
      if (error.response.status === 401) {
        this.setState({ submit: false })
      } else if (error.response.status === 400) {
        this.setState({ submit: false })
      }
    })
  }

  deleteTodo(e){
    console.log(e.target.id);
    axios.delete('http://3.120.96.16:3002/todos/' + e.target.id, {
      headers: {
        Authorization: 'Bearer ' + token$.value,
      },
    })
      .then((response) => {
        console.log("deleted");
        this.componentDidMount();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          this.setState({ delete: false })
        } else if (error.response.status === 400) {
          this.setState({ delete: false })
        }
      })
  }

  onError(){
    if (!this.state.load) {
      return(
        <h1>Error when loading todos</h1>
      )
    } else if (!this.state.submit) {
      return(
        <h1>Error when submitting todo</h1>
      )
    } else if (!this.state.delete) {
      return(
        <h1>Error when deleting todo</h1>
      )
    }
  }

  renderTodos(){
    return this.state.todoArray.map((todo, index) => {
      const { id, content } = todo;
      return(
        <tr key={ id }>
          <td><li>{ content }</li></td>
          <td>
            <button id={ id } onClick={ this.deleteTodo }>Delete</button>
          </td>
        </tr>
      )
    })
  }

  logOut(){
    console.log("logout");
    updateToken("");
    localStorage.removeItem('token');
    this.setState({ loggedout: true })
  }

  render(){
    return(
      <>
      <header>
        <h1>Todo list</h1>
        <h2>{ this.state.email }</h2>
        <Link to={ '/login' }><button >Login</button></Link>
        <Link to={ '/register' }><button >Register</button></Link>
        <Link to={ '/todos' }><button >Todo list</button></Link>
        <Link to={ '/login' }><button onClick={ this.logOut }>Logout</button></Link>
      </header>
        <table>
          <tbody>
            { this.renderTodos() }
          </tbody>
        </table>
        <form onSubmit={ this.onSubmit }>
          <input type="text" onChange={ this.onChange } value={ this.state.content } />
          <input type="submit" />
        </form>
        { this.onError() }
      </>
    )
  }
}

export default Todos;
