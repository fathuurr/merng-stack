import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import PostCard from '../Components/PostCard';

import { Grid, Image } from 'semantic-ui-react';
import SyncLoader from 'react-spinners/SyncLoader';
import { css } from '@emotion/core';
const Home = () => {
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

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

  if (loading) {
    return (
      <div>
        <SyncLoader size={15} color={'#36D7B7'} css={loadingSpinner} />
      </div>
    );
  }
  if (error) {
    return <div>error..</div>;
  }

  const posts = data.getPosts;
  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading Post...</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
};

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
