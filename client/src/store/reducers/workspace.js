import actionTypes from '../actions/actionTypes';
import moment from '../../services/moment';

const initialState = {
  id: null,
  name: '',
  users: [],
  project_set: [],
  task_set: [],
  client_set: [],
  sprints: [],
  category_set: [],
  error: null,
  loading: true,
  sprint_loading: true,
  task_loading: true,
  project_loading: true,
};

const deleteTaskAssociatedSprints = (task, sprints) =>
  sprints.filter(sprint => sprint.task !== task.name);

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.WORKSPACE_LOADING: {
      return { ...state, loading: true };
    }
    case actionTypes.WORKSPACE_LOADED: {
      return {
        ...state,
        ...action.data,
        loading: false,
        error: null,
      };
    }
    case actionTypes.SPRINT_LOADING: {
      return { ...state, sprint_loading: true };
    }
    case actionTypes.SPRINT_LOADED: {
      const { count, results } = action.data;
      /* Here we need to localize the times we take in from the backend, which stores its times
             * in UTC. */
      const currTz = localStorage.getItem('timezone');
      const sprints = results.map((sprint) => {
        const sprint_start = moment(sprint.start_time);
        const sprint_end = moment(sprint.end_time);
        const start_time = sprint_start.tz(currTz).toISOString();
        const end_time = sprint_end.tz(currTz).toISOString();
        return {
          ...sprint,
          start_time,
          end_time,
        };
      });
      return {
        ...state,
        sprint_count: count,
        sprints,
        sprint_loading: false,
      };
    }
    case actionTypes.ADD_TASK: {
      const task = action.data;
      const task_set = [...state.task_set, task];
      return { ...state, task_set };
    }
    case actionTypes.DELETE_TASK: {
      const taskId = action.data;
      const taskToDelete = state.task_set.find(task => task.id === taskId);
      const sprints = deleteTaskAssociatedSprints(taskToDelete, state.sprints);
      const task_set = state.task_set.filter(task => task.id !== taskId);
      return { ...state, sprints, task_set };
    }
    case actionTypes.UPDATE_TASK: {
      const task = action.data;
      const task_set = state.task_set.map((oldTask) => {
        if (oldTask.id === task.id) {
          return task;
        }
        return oldTask;
      });
      return { ...state, task_set };
    }
    case actionTypes.ADD_SPRINT: {
      const sprint = action.data;
      const sprints = [...state.sprints, sprint];
      return { ...state, sprints };
    }
    case actionTypes.DELETE_SPRINT: {
      const id = action.data;
      const sprints = state.sprints.filter(sprint => sprint.id !== id);
      return { ...state, sprints };
    }
    case actionTypes.ADD_PROJECT: {
      const project = action.data;
      const project_set = [...state.project_set, project];
      return { ...state, project_set };
    }
    case actionTypes.DELETE_PROJECT: {
      /*  ACTION INCOMPLETE:
                This action should also take care of cleaning up after deleting a project,
                removing all associated task and sprint data for the task (and sprints)
                which fall under it. This is heavy-lifting, though. */
      const { id } = action.data;
      const projectToDelete = state.project_set.find(project => project.id === id);
      const project_set = state.project_set.filter(project => project.id !== id);
      const associatedTasks = state.task_set
        .filter(task => task.project === projectToDelete.name)
        .map(task => task.name);
      const task_set = state.task_set.filter(task => !associatedTasks.includes(task.name));
      const sprints = state.sprints.filter(sprint => !associatedTasks.includes(sprint.task));
      return {
        ...state,
        sprints,
        task_set,
        project_set,
      };
    }
    case actionTypes.UPDATE_PROJECT: {
      const project = action.data;
      const projectToUpdate = state.project_set.find(proj => proj.id === project.id);
      const project_set = state.project_set.map(proj =>
        ((proj.id === project.id) ? project : proj));
      const task_set = state.task_set.map((task) => {
        if (task.project === projectToUpdate.name) {
          return { ...task, project: project.name };
        }
        return task;
      });
      return { ...state, project_set, task_set };
    }
    case actionTypes.PROJECTS_LOADING: {
      return { ...state, project_loading: true };
    }
    case actionTypes.PROJECTS_LOADED: {
      const projects = action.data;
      return { ...state, project_loading: false, projects };
    }
    case actionTypes.ADD_CATEGORY: {
      const category = action.data;
      const category_set = [...state.category_set, category];
      return { ...state, category_set };
    }
    case actionTypes.DELETE_CATEGORY: {
      const id = action.data;
      const category_set = state.category_set.filter(cat => cat.id !== id);
      const categoryToDelete = state.category_set.find(cat => cat.id === id);
      const task_set = state.task_set.map((task) => {
        const categories = task.categories.filter(cat => cat !== categoryToDelete.name);
        return { ...task, categories };
      });
      return { ...state, category_set, task_set };
    }
    case actionTypes.UPDATE_CATEGORY: {
      const category = action.data;
      const category_set = state.category_set.map((cat) => {
        if (cat.id === category.id) {
          return category;
        }
        return cat;
      });
      return { ...state, category_set };
    }
    case actionTypes.ADD_CLIENT: {
      const client = action.data;
      const client_set = [...state.client_set, client];
      return { ...state, client_set };
    }
    case actionTypes.DELETE_CLIENT: {
      const id = action.data;
      const client_set = state.client_set.filter(client => client.id !== id);
      const project_set = state.project_set.map((project) => {
        if (project.client) {
          const client = project.client.id === id ? null : { ...project.client };
          return { ...project, client };
        }
        return project;
      });
      return { ...state, client_set, project_set };
    }
    case actionTypes.UPDATE_CLIENT: {
      const client = action.data;
      const client_set = state.client_set.map(cli => (cli.id === client.id ? client : cli));
      const project_set = state.project_set.map((project) => {
        if (project.client && project.client.id === client.id) {
          return { ...project, client };
        }
        return project;
      });
      return { ...state, client_set, project_set };
    }
    case actionTypes.SERVER_ERROR: {
      const error = action.data;
      return { ...state, error };
    }
    default:
      return state;
  }
};

export const getProjects = state => state.project_set;

export const getSprints = state => state.sprints;
export const getTodaysSprints = state => state.sprints.filter((sprint) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const midnight = new Date(year, month, day);
  const start = new Date(sprint.start_time).getTime();
  return ((start > midnight.getTime()) && (start < today.getTime()));
});

export const getWorkspaceName = state => state.name;

export const getTasks = state => state.task_set;

export const getActiveTasks = state => state.task_set.filter(task => !task.completed);

export const getCategories = state => state.category_set;

export const getClients = state => state.client_set;

export const getUsers = state => state.users;

