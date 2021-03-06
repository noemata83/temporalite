import axios from 'axios';
import actionTypes from '../actionTypes';
import {
  setupRequest,
  handleServerError,
  handleResponse,
  setTimeZone,
} from '../../helpers/utils';

export const loadSprints = () =>
  (dispatch, getState) => {
    dispatch({ type: actionTypes.SPRINT_LOADING });
    setTimeZone();
    const { headers, workspace } = setupRequest(getState);
    return axios
      .get(`/api/workspaces/${workspace}/sprints/`, { headers })
      .then(res => dispatch(handleResponse(res, actionTypes.SPRINT_LOADED, res.data)))
      .catch(err => dispatch(handleServerError(err)));
  };

export const addSprint = sprint_data =>
  (dispatch, getState) => {
    const { headers, workspace } = setupRequest(getState);
    return axios
      .post(`/api/workspaces/${workspace}/sprints/`, sprint_data, { headers })
      .then(res => dispatch(handleResponse(res, actionTypes.ADD_SPRINT, res.data)))
      .catch(err => dispatch(handleServerError(err)));
  };

export const deleteSprint = sprint_id =>
  (dispatch, getState) => {
    const { headers, workspace } = setupRequest(getState);
    return axios
      .delete(`/api/workspaces/${workspace}/sprints/${sprint_id}/`, { headers })
      .then(res => dispatch(handleResponse(res, actionTypes.DELETE_SPRINT, sprint_id)))
      .catch(err => dispatch(handleServerError(err)));
  };

export const addTaskandSprint = (task_data, sprint_data) =>
  (dispatch, getState) => {
    const { headers, workspace } = setupRequest(getState);
    return axios
      .post(`/api/workspaces/${workspace}/tasks/`, task_data, { headers })
      .then((res) => {
        const data = {
          name: res.data.name,
          id: res.data.id,
          categories: res.data.categories,
          completed: res.data.completed,
        };
        if (res.data.project) data.project = res.data.project.name;
        dispatch({
          type: actionTypes.ADD_TASK,
          data,
        });
        dispatch(addSprint(sprint_data));
      })
      .catch(err => dispatch(handleServerError(err)));
  };
