import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  VERIFY_SUCCESS,
  VERIFY_FAIL,
  SAVE_POST,
  UNSAVE_POST,
  CLEAR_NOTIFICATIONS,
  //   CLEAR_PROFILE,
} from './types';
import setAuthToken from '../utils/setAuthToken';
import { getNotifications } from './notification';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/users');
    dispatch({
      type: USER_LOADED,
      payload: res.data, //user data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/users/register', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlert(errors.msg, 'error'));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/users/login', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
    dispatch(getNotifications());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlert(errors.msg, 'error'));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear profile
export const logout = () => (dispatch) => {
  //TODO
  // dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: CLEAR_NOTIFICATIONS });
  dispatch({ type: LOGOUT });
};

// Verify User
export const verifyUser = (token) => async (dispatch) => {
  setAuthToken(token);
  try {
    const res = await axios.get(`/users/verify/${token}`);

    dispatch({
      type: VERIFY_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    // const errors = err.response.data.errors;

    dispatch({
      type: VERIFY_FAIL,
      payload: err.response.data.errors,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email });

    const res = await axios.post(`/users/forgot`, body, config);

    dispatch(setAlert(`${res.data}`, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlert(errors.msg, 'error'));
    }
  }
};

// Reset Password
export const resetPassword = (formData, token, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put(
      `/users/reset-password/${token}`,
      formData,
      config
    );

    // dispatch(setAlert(`${res.data}`, 'success'));
    history.push('/password-updated');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlert(errors.msg, 'error'));
    }
  }
};

// Save Post
export const savePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/posts/save/${id}`);

    dispatch({
      type: SAVE_POST,
      payload: res.data,
    });

    dispatch(setAlert(`Post saved`, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlert(errors.msg, 'error'));
    }
  }
};

// Save Post
export const unsavePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/posts/unsave/${id}`);

    dispatch({
      type: UNSAVE_POST,
      payload: { ...res.data, id: id },
    });

    dispatch(setAlert(`Post unsaved`, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlert(errors.msg, 'error'));
    }
  }
};
