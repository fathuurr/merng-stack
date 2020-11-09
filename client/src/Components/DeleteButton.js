import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  FETCH_POSTS_QUERY,
  DELETE_POST_MUTATION,
  DELETE_COMMENT_MUTATION,
} from '../util/graphql';

import { Button, Confirm, Icon } from 'semantic-ui-react';

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy, result) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: [result.data.createPost, ...data.getPosts],
          },
        });
      }
    },
    onError: (err) => {
      // also add this so the page doesn't break
      return err;
    },
    variables: {
      postId,
      commentId,
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
        onConfirm={deletePostOrMutation}
      />
    </>
  );
};

export default DeleteButton;
