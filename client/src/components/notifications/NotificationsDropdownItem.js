import React, { useState } from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { markAsRead } from '../../actions/notification';

const NotificationsDropdownItem = ({ notification, markAsRead }) => {
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
        className={read === false ? `item` : `active item`}
        style={{
          wordWrap: 'break-word',
          flex: 'inherit',
          whiteSpace: 'normal',
        }}
      >
        <Link
          to={
            type === 'request'
              ? `/${data.acronym}/${data.name}`
              : `/${data.categoryAcronym}/${data.moduleName}/${action}`
          }
          onClick={() => markAsRead(_id)}
        >
          <div className="ui list">
            <div className="item">
              <div className="ui grid">
                <div
                  className="three wide column"
                  style={{ paddingRight: '0', margin: 'auto' }}
                >
                  <img
                    className="ui avatar image"
                    src={
                      type === 'request'
                        ? `https://i.ibb.co/jHjp6qk/square-logo.jpg`
                        : `${profile.avatar}`
                    }
                  />
                </div>
                <div
                  className="thirteen wide column"
                  style={{ paddingLeft: '0px' }}
                >
                  <div className="content">
                    <div
                      className={read === true ? 'header grey-text' : 'header'}
                      style={{
                        fontWeight: read === true ? 'normal' : 'bold',
                      }}
                    >
                      {type === 'request'
                        ? `Your module request has been approved by admin`
                        : type === 'upvote'
                        ? `${profile.name} upvoted your post`
                        : `${profile.name} commented on your post`}
                    </div>
                    <div className="description small-text">
                      <Moment fromNow>{date}</Moment>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  );
};

NotificationsDropdownItem.propTypes = {
  markAsRead: PropTypes.func.isRequired,
};

export default connect(null, { markAsRead })(NotificationsDropdownItem);
