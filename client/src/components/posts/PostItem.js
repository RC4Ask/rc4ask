import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import EditPostFormModal from './EditPostFormModal';
import ConfirmationModal from '../ConfirmationModal';
import { deletePost, upvotePost, downvotePost } from '../../actions/post';
import { unsavePost, savePost } from '../../actions/auth';
import axios from 'axios';

const PostItem = ({
  post,
  auth,
  deletePost,
  upvotePost,
  downvotePost,
  savePost,
  unsavePost,
}) => {
  const {
    _id,
    moduleName,
    authorName,
    author,
    date,
    title,
    text,
    upvote,
    downvote,
    comments,
    categoryAcronym,
  } = post;

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    axios
      .get(`/profiles/${author}`)
      .then((response) => setAvatar(response.data.avatar));
  }, []);

  const [isShowing, setShowing] = useState(false);
  const [modalShowing, setModalShowing] = useState(false);
  const closeModalHandler = () => {
    setModalShowing(false);
  };
  const actions = (
    <Fragment>
      <button onClick={() => deletePost(_id)} className="ui button red-button">
        Yes
      </button>
      <button onClick={closeModalHandler} className="ui button">
        Cancel
      </button>
    </Fragment>
  );

  return (
    avatar && (
      <div className="ui segment">
        <div className="ui top attached label red-label">
          <div className="ui grid">
            <div className="ui four wide column">
              {/* MODIFY THIS */}
              <Link
                to={`/${categoryAcronym}/${moduleName}`}
                style={{ color: 'inherit' }}
              >
                {`${moduleName}`}
              </Link>
            </div>
            <div className="ui right floated twelve wide column right-text">
              <Moment fromNow>{date}</Moment>
            </div>
          </div>
        </div>
        <div className="ui stackable grid">
          <div className="ui three wide column">
            <img
              className="ui tiny circular centered image"
              src={avatar}
              alt=""
            />
            {!auth.loading && auth.user._id === author ? (
              <Link to={`/profile/me`} className="center-text padding-text">
                <h4>{`${authorName}`}</h4>
              </Link>
            ) : (
              <Link
                to={`/profile/${author}`}
                className="center-text padding-text"
              >
                <h4>{`${authorName}`}</h4>
              </Link>
            )}
          </div>
          <div className="ui thirteen wide column">
            <h3>{`${title}`}</h3>
            <p style={{ wordWrap: 'break-word' }}>{`${text}`}</p>

            {!auth.loading && auth.user && (
              <Fragment>
                <div className="ui labeled small button" tabIndex="0">
                  <button
                    onClick={() => upvotePost(_id)}
                    className={`ui icon small button ${
                      upvote.indexOf(auth.user._id) === -1 ? '' : 'red-button'
                    }`}
                  >
                    <i className="thumbs up icon"></i>
                  </button>
                  <div className="ui basic label">{`${upvote.length}`}</div>
                </div>
                <div className="ui labeled small button" tabIndex="0">
                  <button
                    onClick={() => downvotePost(_id)}
                    className={`ui icon small button ${
                      downvote.indexOf(auth.user._id) === -1 ? '' : 'red-button'
                    }`}
                  >
                    <i className="thumbs down icon"></i>
                  </button>
                  <div className="ui basic label">{`${downvote.length}`}</div>
                </div>
              </Fragment>
            )}
            <div className="ui labeled small button" tabIndex="0">
              {/* MODIFY THIS */}
              <Link
                to={`/${categoryAcronym}/${moduleName}/${_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ui icon small button"
              >
                <i className="conversation icon"></i>
              </Link>
              <div className="ui basic label">{`${comments.length}`}</div>
            </div>
            {!auth.loading && auth.user && (
              <Fragment>
                <button
                  onClick={() =>
                    auth.user.saved && auth.user.saved.indexOf(_id) > -1
                      ? unsavePost(_id)
                      : savePost(_id)
                  }
                  className={`ui icon small button ${
                    auth.user.saved && auth.user.saved.indexOf(_id) > -1
                      ? 'red-button'
                      : ''
                  }`}
                >
                  <i className="ui icon bookmark"></i>
                </button>
              </Fragment>
            )}
            {!auth.loading && author === auth.user._id && (
              <Fragment>
                <button
                  onClick={() => setShowing(true)}
                  className="ui right floated icon small button"
                >
                  <i className="ui icon pencil"></i>
                </button>
                <button
                  // onClick={() => deletePost(_id)}
                  onClick={() => setModalShowing(true)}
                  className="ui right floated icon small button"
                >
                  <i className="ui icon trash"></i>
                </button>
              </Fragment>
            )}
          </div>
        </div>
        {isShowing && <EditPostFormModal setShowing={setShowing} post={post} />}
        {modalShowing && (
          <ConfirmationModal
            onDismiss={closeModalHandler}
            title="Delete Post"
            content="Are you sure you want to delete this post?"
            actions={actions}
          />
        )}
      </div>
    )
  );
};

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  upvotePost: PropTypes.func.isRequired,
  downvotePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deletePost,
  upvotePost,
  downvotePost,
  savePost,
  unsavePost,
})(PostItem);
