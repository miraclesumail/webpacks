import { PropTypes } from 'prop-types'
import { Mutation, Query } from 'react-apollo'
import React, { Component, Fragment } from 'react'
import gql from 'graphql-tag'

const GET_TODO = gql`
    query getTodo($name: String!) {
        todo(name: $name) @client {
            text
            completed
        }
    }
`

const TODO = ({todo}) => {
       console.log(todo, '对了对了对了对了对了对了对了')
       return <div>{todo ? todo.text : 'dsssksk'}</div>

}
    // <div>{todo.text ? todo.text : 'nonoo'} --- {todo.completed ? '完成' : '待办'}</div>

class AddTotoView extends Component {
      state = {
          name: 'dddd'
      }

      inputEl;

      componentDidMount() {
          setTimeout(() => {
              this.setState({name: 'eeee'})
          }, 2000);
      }
      

      handleSubmit = (e) => {
         e.preventDefault();
         const { addTodo } = this.props;
         const text = this.inputEl.value.trim();
         if (!text) return;
         addTodo({ variables: { text } });
         this.inputEl.value = '';
      }

      render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                <input ref={node => { this.inputEl = node; }} />
                <button type="submit">Add Todo</button>
                </form>
                <Query query={GET_TODO} variables={{ name: this.state.name}}>
                   {({ data:{ todo } }) => <TODO todo={todo}/>}
                </Query>
            </div>
        )
      }
}

AddTotoView.propTypes = {
    addTodo: PropTypes.func.isRequired
}

const ADD_TODO = gql`
    mutation addTodo($text: String!) {
        addTodo(text: $text) @client {
            id
        }
    }
`
const AddTodo = () => (
    <Fragment>
        <Mutation mutation={ADD_TODO}>
           {addTodo => (<AddTotoView addTodo={addTodo}/>)}
        </Mutation>     
    </Fragment>
)


export default AddTodo;