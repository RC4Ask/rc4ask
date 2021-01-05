import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logo from '../../img/name_white.png';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="ui x-large">
            <img className="large-image" src={logo} alt="ladybug"></img>
          </h1>
          <p className="ui center aligned lead">
            Ask questions, discuss, and get help from other students.
          </p>
          <div className="ui row">
            <Link to="/register" className="ui big teal button">
              <i className="signup icon"></i>
              Register
            </Link>
            <Link to="/login" className="ui big button">
              <i className="sign-in icon"></i>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
