import React from 'react';
import './App.css';
import axios from 'axios';
import { token$, updateToken } from './Store.js';
import jwt from 'jsonwebtoken';
import { Redirect } from 'react-router-dom';


class Todos extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: "",
      content: "",
      todoArray: [],
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  componentDidMount(){
    this.subscription = token$.subscribe((token) => {
      console.log(token);
      axios.get('http://3.120.96.16:3002/todos', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({ todoArray: response.data.todos })
        const decoded = jwt.decode(token);
        console.log(decoded);
        this.setState({ email: decoded.email })
    }).catch((err) => {
      console.log(err);
    })
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
      console.log("success");
      this.componentDidMount();
      this.setState({ content: "" })
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
      .catch((err) => {
        console.log(err);
      })
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

  render(){
    console.log(this.state.todoArray);
    return(
      <>
        <h1>{ this.state.email }</h1>
        <table>
          { this.renderTodos() }
        </table>
        <form onSubmit={ this.onSubmit }>
          <input type="text" onChange={ this.onChange } value={ this.state.content } />
          <input type="submit" />
        </form>
      </>
    )
  }
}

export default Todos;
