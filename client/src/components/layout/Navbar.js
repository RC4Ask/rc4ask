import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import NotificationDropdown from '../notifications/NotificationsDropdown';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../img/logo_web.png';
import logo_white from '../../img/logo_web_white.png';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const guestLinks = (
    <div className="right menu ">
      <Link to="/register" onClick={logout} className="item">
        Register
      </Link>
      <Link to="/login" onClick={logout} className="item">
        Login
      </Link>
    </div>
  );

  return (
    !loading && (
      <Fragment>
        {' '}
        {isAuthenticated && user && user.verified ? (
          <div className="ui inverted fixed big menu navbar">
            <div className="ui container">
              <Link to="/" className="item">
                <img className="ui middle aligned tiny image" src={logo}></img>
              </Link>

              <div className="right menu ">
                <Link to="/home" className="item">
                  Home
                </Link>
                <Link to="/explore" className="item">
                  Explore
                </Link>
                {user.role == 'admin' && (
                  <Link to="/requests" className="hide-content item">
                    Requests
                  </Link>
                )}

                <div className="ui simple dropdown item">
                  <NotificationDropdown />
                </div>
                <div className="ui simple dropdown vertically fitted item">
                  <img
                    style={{ margin: 'auto' }}
                    className="ui avatar image xsmall-image"
                    src={`${user.avatar}`}
                    alt=""
                  />
                  <div className="ui small vertical menu">
                    <Link to="/saved-posts" className="item">
                      <i className="bookmark icon"></i>Saved posts
                    </Link>
                    {user.role == 'admin' && (
                      <Link
                        to="/requests"
                        className="item show-content"
                        style={{ display: 'none' }}
                      >
                        <i className="sticky note icon"></i> Requests
                      </Link>
                    )}
                    <Link to={`/profile/me`} className="item">
                      <i className="user icon"></i>Profile
                    </Link>
                    <Link to="/login" onClick={logout} className="item">
                      <i className="sign-out icon"></i>Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
            ) : (
              <div className="ui inverted fixed big menu navbar" id="navbar-transparent">
                <div className="ui container">
                  <Link to="/" className="item" style={{border: "none"}}>
                    <img className="ui middle aligned tiny image" src={logo_white}></img>
                  </Link>
                  {guestLinks}
                </div>
              </div>
            )}{' '}
          </Fragment>
        )
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
