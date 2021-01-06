import axios from 'axios';
import { setAlert } from './alert';
import { deleteRequest } from './request';
import {
  GET_MODULES,
  GET_MODULES_RECOMMENDATIONS,
  GET_MODULES_IN_UNIVERSITY,
  GET_MODULE,
  MODULES_ERROR,
  MODULE_ERROR,
  UPDATE_FOLLOWERS,
  GET_FOLLOWEDMODULES,
  ADD_MODULE,
} from './types';

// Get all modules
export const getModules = () => async (dispatch) => {
  try {
    const res = await axios.get(`/modules`);

    dispatch({
      type: GET_MODULES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MODULES_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get modules recommendations
export const getModulesRecommendations = () => async (dispatch) => {
  try {
    const res = await axios.get(`/modules/recommendations`);

    dispatch({
      type: GET_MODULES_RECOMMENDATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MODULES_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all modules in university
export const getModulesInUniversity = (acronym) => async (dispatch) => {
  try {
    const res = await axios.get(`/universities/modules/${acronym}`);

    dispatch({
      type: GET_MODULES_IN_UNIVERSITY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MODULES_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get module by id
export const getModule = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/modules/${id}`);
    dispatch({
      type: GET_MODULE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: MODULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get module by uni acronym and module name
export const getModuleByName = (uniName, moduleName) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/universities/modules/${uniName}/${moduleName}`
    );
    dispatch({
      type: GET_MODULE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: MODULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Follow a module
export const followModule = (id, name) => async (dispatch) => {
  try {
    const res = await axios.put(`/users/follow/${id}`);
    dispatch({
      type: UPDATE_FOLLOWERS,
      payload: { id, followers: res.data },
    });

    dispatch(setAlert(`Followed ${name}`, 'success'));
  } catch (err) {
    dispatch({
      type: MODULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Unfollow a module
export const unfollowModule = (id, name) => async (dispatch) => {
  try {
    const res = await axios.put(`/users/unfollow/${id}`);
    dispatch({
      type: UPDATE_FOLLOWERS,
      payload: { id, followers: res.data },
    });
    dispatch(setAlert(`Unfollowed ${name}`, 'success'));
  } catch (err) {
    dispatch({
      type: MODULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get followed modules
export const getFollowedModules = (uniId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ uniId });

    const res = await axios.get(`/users/modules/`, body, config);

    dispatch({
      type: GET_FOLLOWEDMODULES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MODULE_ERROR,
      payload: { msg: err.response, status: err.response },
    });
  }
};

// Create university and module
export const addUniModule = (formData, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/categories/create`, formData, config);
    dispatch(setAlert(res.data, 'success'));
    dispatch(deleteRequest(id, true));
  } catch (err) {
    console.log(err.response.data.errors);
    dispatch({
      type: MODULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addModule = (formData, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/modules/add`, formData, config);
    dispatch(setAlert(res.data, 'success'));
    dispatch(deleteRequest(id, true));
  } catch (err) {
    console.log(err.response.data.errors);
    dispatch({
      type: MODULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
