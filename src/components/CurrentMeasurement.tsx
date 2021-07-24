import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../store';

const useStyles = makeStyles({
  subtitle: {
    textAlign: 'center',
  },
  value: {
    textAlign: 'center',
  },
  container: {
    marginBottom: 20,
  },
});

export default () => {
  const classes = useStyles();
  const curMeasurement = useSelector((state: IState) => state.curMeasurement);
  if (curMeasurement.metric)
    return (
      <div className={classes.container}>
        <Typography variant="subtitle1" className={classes.subtitle}>
          {curMeasurement.metric}
        </Typography>
        <Typography variant="h2" className={classes.value}>
          {curMeasurement.value}
        </Typography>
      </div>
    );
  else return null;
};
