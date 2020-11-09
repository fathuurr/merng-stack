import React, { useContext, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import { FETCH_POST_QUERY, SUBMIT_COMMENT_MUTATION } from '../util/graphql';

import LikeButton from '../Components/LikeButton';
import DeleteButton from '../Components/DeleteButton';

import {
  Button,
  Card,
  Grid,
  Image,
  Icon,
  Label,
  Form,
} from 'semantic-ui-react';
import { SyncLoader } from 'react-spinners';
import { css } from '@emotion/core';

const SinglePost = (props) => {
  const loadingSpinner = css`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
  `;

  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  if (loading) {
    return <SyncLoader size={15} color={'#36D7B7'} css={loadingSpinner} />;
  }

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;
  if (!data) {
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              float='right'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header> {username} </Card.Header>
                <Card.Meta> {moment(createdAt).fromNow(true)} </Card.Meta>
                <Card.Description> {body} </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as='div'
                  labelPosition='right'
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color='blue'>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='blue' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a Comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        name='comment'
                        placeholder='Comment ...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal '
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        {' '}
                        Submit{' '}
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header> {comment.username} </Card.Header>
                  <Card.Meta> {moment(comment.createdAt).fromNow()} </Card.Meta>
                  <Card.Description> {comment.body} </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

export default SinglePost;
