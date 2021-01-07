import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';

import { login } from '../../actions/auth';

const Login = ({ login, auth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (
    !auth.loading &&
    auth.isAuthenticated &&
    auth.user &&
    auth.user.verified
  ) {
    return <Redirect to="/home" />;
  }

  if (
    !auth.loading &&
    auth.isAuthenticated &&
    auth.user &&
    !auth.user.verified
  ) {
    // console.log(auth);
    return <Redirect to="/verification" />;
  }

  return (
    <Fragment>
      <div className="red-background">
        <div className="ui container-body">
          <Alert />
          <div className="form-center">
            <h1 className="large white-text center-text">Welcome back!</h1>
            <form className="ui form" onSubmit={onSubmit}>
              <div className="ui segment" id="login-segment">
                <h3 className="ui dividing header"> Login to Your Account</h3>
                <div className="field">
                  <label className="header">Email</label>
                  <div className="ui left icon input" >
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
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="ui vertical animated fluid large submit button red-button"
                >
                  <div className="visible content">Login</div>
                  <div className="hidden content">
                    <i className="sign-in icon"></i>
                  </div>
                </button>
              </div>
              <div className="ui bottom attached message center-mobile" id="login-bottom">
                New to us? <Link to="/register">Register</Link>
                <Link
                  className="float-mobile"
                  // style={{ float: 'right' }}
                  to="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login })(Login);
