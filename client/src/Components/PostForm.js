import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

import { Button, Form } from 'semantic-ui-react';

const PostForm = ({ refetch }) => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error, loading }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = '';
    },
    onError: (err) => {
      // also add this so the page doesn't break
      return err;
    },
  });
  function createPostCallback() {
    createPost();
  }

  if (loading) {
    return <div> Wait a second ... </div>;
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create Post</h2>
        <Form.Field>
          <Form.Input
            placeholder='Hello .. '
            name='body'
            onChange={onChange}
            error={error ? true : false}
            value={values.body}
          />
          <Button type='submit' color='teal'>
            Submit
          </Button>
        </Form.Field>
      </Form>

      {error && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li> {error.graphQLErrors[0].message} </li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
