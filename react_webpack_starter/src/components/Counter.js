import gql from 'graphql-tag';
import { PropTypes } from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';

const CounterView = ({ counter, text }) => (
  <div>{counter}---{text}</div>
);

CounterView.propTypes = {
  counter: PropTypes.number.isRequired,
};

const GET_COUNTER = gql`
  {
    counter @client
  }
`;

const Counter = () => (
  <Query query={GET_COUNTER}>
    {({ data }) => {
      return <CounterView {...{...data,text: 'dddrrrd'}}/>;
    }}
  </Query>
);

export default Counter;