import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';

import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

const Register = ({ setAlert, register, auth }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'error');
    } else {
      register({ name, email, password });
    }
  };

  if (
    !auth.loading &&
    auth.isAuthenticated &&
    auth.user &&
    !auth.user.verified
  ) {
    return <Redirect to="/verification" />;
  }

  if (
    !auth.loading &&
    auth.isAuthenticated &&
    auth.user &&
    auth.user.verified
  ) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="red-background">
      <div className="ui container-body">
        <Alert />
        {/* <div className="ui negative message">Invalid Credentials</div> */}
        <div className="form-center">
          <h1 className="large white-text center-text">Get Started!</h1>
          <form className="ui form" onSubmit={(e) => onSubmit(e)}>
            <div className="ui segment" id="register-segment">
              <h3 className="ui dividing header"> Create an Account</h3>
              <div className="field">
                <label className="header">Name</label>
                <div className="ui left icon input">
                  <i className="user icon"></i>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => onChange(e)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="header">Email</label>
                <div className="ui left icon input">
                  <i className="envelope icon"></i>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => onChange(e)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="">Password</label>
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => onChange(e)}
                    required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
                  />
                </div>
              </div>
              <div className="field">
                <label className="">Confirm Password</label>
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                    type="password"
                    name="password2"
                    placeholder="Confirm password"
                    value={password2}
                    onChange={(e) => onChange(e)}
                    required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
                  />
                </div>
              </div>
              <button
                type="submit"
                name="submit"
                className="ui vertical animated fluid large submit button red-button"
              >
                <div className="visible content">Register</div>
                <div className="hidden content">
                  <i className="signup icon"></i>
                </div>
              </button>
            </div>
            <div className="ui message" id="register-bottom">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
