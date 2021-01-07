import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';
import Posts from './Posts';
import PostForm from './PostForm';
import PostFormModalFixed from './PostFormModalFixed';
import { getUniversity } from '../../actions/university';
import { getModuleByName } from '../../actions/module';
import { followModule, unfollowModule } from '../../actions/module';

const PostsCategory = ({
  match,
  getModuleByName,
  getUniversity,
  followModule,
  unfollowModule,
  module: { module, loading },
  university,
  auth,
}) => {
  const universityLoading = university.loading;
  const universityInfo = university.university;
  const authLoading = auth.loading;
  const user = auth.user;

  useEffect(() => {
    getUniversity(match.params.uni);
    getModuleByName(match.params.uni, match.params.module);
  }, [getModuleByName, getUniversity]);

  const [icon, setIcon] = useState(null);
  const [isShowing, setShowing] = useState(false);
  const [activeOverview, setActiveOverview] = useState(true);
  const [activePosts, setActivePosts] = useState(false);

  const toggleOverview = () => {
    setActiveOverview(true);
    setActivePosts(false);
  };

  const togglePosts = () => {
    setActiveOverview(false);
    setActivePosts(true);
  };

  const overview = !universityLoading && !loading && universityInfo && module && (
    <Fragment>
      <div className="ui segment red-segment center-text">
        <h1 className="x-large">{`${module.name}`}</h1>
        <div className="lead">{`${module.title}`}</div>
      </div>
      <div className="ui stackable grid">
        <div className="four wide column remove-padding">
          <div className="ui segment">
            <div className="ui one statistics">
              <div className="statistic">
                <div className="value">{`${module.followers.length}`}</div>
                <div className="label">Followers</div>
              </div>
            </div>
            <div className="ui divider"></div>
            <div className="ui one statistics">
              <div className="statistic">
                <div className="value">{`${module.posts.length}`}</div>
                <div className="label">Posts</div>
              </div>
            </div>
          </div>
        </div>
        <div className="twelve wide column">
          <div className="ui segment">
            <h3>Category:</h3>
            <Link to={`/${match.params.uni}`}>
              <p>{`${universityInfo.name}`}</p>
            </Link>
            <h3>Module description:</h3>
            <p>{`${module.description}`}</p>
            {/* <h3>Prerequisite:</h3>
            <p>CS1010</p>
            <h3>Preclusion:</h3>
            <p>CS1020</p> */}
          </div>
        </div>
      </div>
    </Fragment>
  );

  const posts = !loading && module && !authLoading && user && (
    <Fragment>
      <PostForm setShowing={setShowing} name={user.name} />
      <Posts moduleId={module._id} />
    </Fragment>
  );

  return loading ||
    !module ||
    authLoading ||
    !user ||
    universityLoading ||
    !universityInfo ||
    module.name != match.params.module ? (
    <div className="ui centered active loader"></div>
  ) : (
    <div>
      <div className="container-body">
        <Alert />
        {auth &&
          !loading &&
          module &&
          icon === null &&
          setIcon(
            module.followers.indexOf(auth.user._id) === -1 ? 'plus' : 'minus'
          )}
        {!universityLoading && !loading && universityInfo && module && (
          <div className="ui stackable grid">
            <div className="twelve wide centered column">
              <div className="ui grid">
                <div className="eight wide column">
                  <h1 className="red-text">Welcome to {`${module.name}`}!</h1>
                </div>
                <div className="eight wide right aligned column">
                  <button
                    onClick={() => {
                      if (icon === 'plus') {
                        setIcon('minus');
                        followModule(module._id, module.name);
                      } else {
                        setIcon('plus');
                        unfollowModule(module._id, module.name);
                      }
                    }}
                    className="ui button red-button"
                  >
                    <i className={`ui icon ${icon}`}></i>
                    {icon === 'plus' ? 'Follow' : 'Unfollow'} {`${module.name}`}
                  </button>
                </div>
              </div>
              <div className="ui secondary pointing menu">
                <a
                  onClick={toggleOverview}
                  className={`item ${activeOverview ? 'active' : ''}`}
                >
                  Overview
                </a>
                <a
                  onClick={togglePosts}
                  className={`item ${activePosts ? 'active' : ''}`}
                >
                  Posts
                </a>
              </div>
              <div className="">{activeOverview ? overview : posts}</div>
            </div>
          </div>
        )}
      </div>
      {isShowing && (
        <PostFormModalFixed setShowing={setShowing} module={module} />
      )}
    </div>
  );
};

PostsCategory.propTypes = {
  getModuleByName: PropTypes.func.isRequired,
  getUniversity: PropTypes.func.isRequired,
  unfollowModule: PropTypes.func.isRequired,
  followModule: PropTypes.func.isRequired,
  module: PropTypes.object.isRequired,
  university: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  module: state.module,
  university: state.university,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getUniversity,
  getModuleByName,
  unfollowModule,
  followModule,
})(PostsCategory);
