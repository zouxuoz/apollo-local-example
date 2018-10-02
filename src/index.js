import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { ApolloProvider, Query } from 'react-apollo'; 
import gql from 'graphql-tag';

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: {
    common: 'common',
  },
  resolvers: {
    Query: {
      custom: () => 'custom',
    },
  },
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    stateLink,
  ]),
});

const TEST_COMMON_QUERY = gql`
  query {
    common @client
  }
`;

const TEST_CUSTOM_QUERY = gql`
  query {
    custom @client
  }
`;

class Application extends React.Component {
  renderCommonContent = ({ loading, data }) => {
    console.log('renderCommonContent', loading, data);

    return loading ? 'Loading...' : data.common;
  };

  renderCustomContent = ({ loading, data }) => {
    console.log('renderCustomContent', loading, data);

    return loading ? 'Loading...' : data.custom;
  };

  render() {
    return (
      <div className="Application">
        <Query query={TEST_COMMON_QUERY}>
          {this.renderCommonContent}
        </Query>
        <Query query={TEST_CUSTOM_QUERY}>
          {this.renderCustomContent}
        </Query>
      </div>
    );
  }
}

ReactDOM.render((
  <ApolloProvider client={client}>
    <Application />
  </ApolloProvider>
), document.getElementById('root'));