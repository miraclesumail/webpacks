import gql from 'graphql-tag';

const query = gql`
{
      counter @client
}
`

let nextTodoId = 2;

export default {
    Query: {
        todo: (_, {name}, {cache}) => {
            const query = gql`
                  query GetToDos {
                      todos @client {
                          id
                          text
                          completed
                      }
                  }
            `
            const { todos } = cache.readQuery({query});
            return todos.filter(item => item.text == name)[0]
        }
    },
    Mutation: {
        addTodo: (_, {text}, {cache}) => {
            const query = gql`
                  query GetToDos {
                      todos @client {
                          id
                          text
                          completed
                      }
                  }
            `
            const previous = cache.readQuery({query});
            const newTodo = {
                id: nextTodoId++,
                text,
                completed: false,
                __typename: 'TodoItem',
            };
            const data = {
                todos: previous.todos.concat([newTodo]),
            };
            cache.writeData({ data });
            return newTodo;
        },
        decrementCounter: (_, params, {cache}) => {
            const { counter } = cache.readQuery({ query });
            const nextCounter = counter - 1;
            const data = {
                counter: nextCounter,
            };
            cache.writeData({ data });
            return nextCounter;
        },
        incrementCounter: (_, params, { cache }) => {
            const { counter } = cache.readQuery({ query });
            const nextCounter = counter + 1;
            const data = {
                counter: nextCounter,
            };
            cache.writeData({ data });
            return nextCounter;
        },
        toggleTodo: (_, variables, { cache }) => {
            const id = `TodoItem:${variables.id}`;
            const fragment = gql`
                fragment completeTodo on TodoItem {
                    completed
                }
            `;
            const todo = cache.readFragment({ fragment, id });
            const data = { ...todo, completed: !todo.completed };
            cache.writeData({ id, data });
            return null;
        }
    }
}