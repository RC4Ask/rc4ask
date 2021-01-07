import React, { useState } from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { markAsRead, deleteNotification } from '../../actions/notification';

const NotificationsItem = ({
  notification,
  markAsRead,
  deleteNotification,
}) => {
  const { _id, user, action, type, read, date } = notification;
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState(null);
  useState(() => {
    axios
      .get(`/profiles/${user}`)
      .then((response) => setProfile(response.data));
    if (type !== 'request') {
      axios.get(`/posts/${action}`).then((response) => setData(response.data));
    } else {
      axios
        .get(`/modules/${action}`)
        .then((response) => setData(response.data));
    }
  }, []);
  return (
    profile &&
    data && (
      <div
        className="ui segment"
        style={{
          backgroundColor: read === true ? '#f7f7f7' : 'inherit',
          boxShadow: read === true ? 'none' : '',
        }}
      >
        <div className="ui comments">
          <div className="comment">
            <Dropdown
              icon="ellipsis vertical"
              direction="left"
              style={{ float: 'right' }}
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  text="Mark as read"
                  onClick={() => markAsRead(_id)}
                />
                <Dropdown.Item
                  text="Delete"
                  onClick={() => deleteNotification(_id)}
                />
              </Dropdown.Menu>
            </Dropdown>
            <a className="avatar">
              <img
                src={
                  type === 'request'
                    ? `https://i.ibb.co/jHjp6qk/square-logo.jpg`
                    : `${profile.avatar}`
                }
              />
            </a>
            <div className="content">
              <Link
                to={
                  type === 'request'
                    ? `/${data.acronym}/${data.name}`
                    : `/${data.categoryAcronym}/${data.moduleName}/${action}`
                }
                onClick={() => markAsRead(_id)}
                className={read === true ? 'author grey-text' : 'author'}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: read === true ? 'normal' : 'bold',
                }}
              >
                {type === 'request'
                  ? `Your module request has been approved by admin`
                  : type === 'upvote'
                  ? `${profile.name} upvoted your post`
                  : `${profile.name} commented on your post`}
              </Link>
              <div className="text small-text">
                <Moment fromNow>{date}</Moment>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

NotificationsItem.propTypes = {
  markAsRead: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
};

export default connect(null, { markAsRead, deleteNotification })(
  NotificationsItem
);
