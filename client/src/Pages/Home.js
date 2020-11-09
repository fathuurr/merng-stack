import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from '../util/graphql';

import PostCard from '../Components/PostCard';
import PostForm from '../Components/PostForm';

import { Grid, Transition } from 'semantic-ui-react';
import SyncLoader from 'react-spinners/SyncLoader';
import { css } from '@emotion/core';
const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, error, data, refetch } = useQuery(FETCH_POSTS_QUERY);

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
        {user && (
          <Grid.Column>
            <PostForm refetch={refetch} />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Post...</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
