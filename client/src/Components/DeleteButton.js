import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';

import { Button, Confirm, Icon } from 'semantic-ui-react';

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_QUERY, {
    update(proxy, result) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
    },
    onError: (err) => {
      // also add this so the page doesn't break
      return err;
    },
    variables: {
      postId,
    },
  });

  return (
    <>
      <Button
        as='div'
        color='red'
        floated='right'
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name='trash' style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </>
  );
};

const DELETE_POST_QUERY = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
