import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';

import moment from '../../../../services/moment';
import Sprint from '../../Sprint/Sprint';
import classes from './Day.css';

const day = (props) => {
  const sprintList = props.sprints.map(sprint => (
    <Sprint key={sprint.id} sprint={sprint} label={sprint.task} />
  ));
  const duration = props.sprints.reduce(
    (total, sprint) => moment.duration(total).add(sprint.duration),
    moment.duration(0),
  );
  const { compressed } = props;
  return (
    <div className={classes.Day} style={{ height: compressed ? '100%' : 'unset', overflowY: compressed ? 'auto' : 'hidden' }} >
      {!compressed && <Toolbar className={classes.ToolBar}>
        <div className={classes.Date}>{props.date}</div>
        <div className={classes.Duration}>{duration.format('hh:mm:ss', { trim: false })}</div>
      </Toolbar> }
      <List>{sprintList}</List>
    </div>
  );
};

day.defaultProps = {
  date: '',
};

day.propTypes = {
  sprints: PropTypes.array.isRequired, // eslint-disable-line
  date: PropTypes.string,
};

export default day;
