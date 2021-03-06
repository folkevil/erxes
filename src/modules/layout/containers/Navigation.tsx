import gql from 'graphql-tag';
import { queries, subscriptions } from 'modules/inbox/graphql';
import { UnreadConversationsTotalCountQueryResponse } from 'modules/inbox/types';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import { Navigation } from '../components';

class NavigationContainer extends React.Component<{
  unreadConversationsCountQuery: UnreadConversationsTotalCountQueryResponse;
}> {
  componentWillMount() {
    this.props.unreadConversationsCountQuery.subscribeToMore({
      // listen for all conversation changes
      document: gql(subscriptions.conversationClientMessageInserted),

      updateQuery: () => {
        this.props.unreadConversationsCountQuery.refetch();

        // notify by sound
        const audio = new Audio('/sound/notify.mp3');
        audio.play();
      }
    });
  }

  render() {
    const { unreadConversationsCountQuery } = this.props;
    const unreadConversationsCount =
      unreadConversationsCountQuery.conversationsTotalUnreadCount || 0;

    const props = {
      unreadConversationsCount
    };

    return <Navigation {...props} />;
  }
}

export default withProps<{}>(
  compose(
    graphql<{}, UnreadConversationsTotalCountQueryResponse>(
      gql(queries.unreadConversationsCount),
      {
        name: 'unreadConversationsCountQuery',
        options: () => ({
          notifyOnNetworkStatusChange: true
        })
      }
    )
  )(NavigationContainer)
);
