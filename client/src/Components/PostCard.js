import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Label, Icon, Image } from 'semantic-ui-react';
import moment from 'moment';
const PostCard = ({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
  const likePost = () => {
    console.log('Like Post!!');
  };
  const commentOnPost = () => {
    console.log('Comment !!');
  };
  return (
    <div>
      <Card fluid>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header> {username} </Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>
            {' '}
            {moment(createdAt).fromNow(true)}{' '}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button as='div' labelPosition='right' onClick={likePost}>
            <Button color='red' basic>
              <Icon name='heart' />
            </Button>
            <Label basic color='red' pointing='left'>
              {likeCount}
            </Label>
          </Button>
          <Button as='div' labelPosition='right' onClick={commentOnPost}>
            <Button color='blue' basic>
              <Icon name='comments' />
            </Button>
            <Label basic color='blue' pointing='left'>
              {commentCount}
            </Label>
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PostCard;
