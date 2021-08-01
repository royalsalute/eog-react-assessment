import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid, { GridSpacing } from '@material-ui/core/Grid';

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

type Measurement = {
  metric: string;
  value: number;
  unit: string;
};

const CurMeasurementWidget = (props: any) => {
  const classes = useStyles();
  const { measurement } = props;
  return (
    <Grid item xs={4} spacing={3}>
      <Paper>
        <Typography variant="subtitle1" className={classes.subtitle}>
          {measurement.metric}
        </Typography>
        <Typography variant="h4" className={classes.value}>
          {measurement.value}{measurement.unit}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default forwardRef((props, ref) => {
  const classes = useStyles();
  const [data, setData] = useState<Measurement[]>([]);

  useImperativeHandle(ref, () => ({
    onNewMeasurement(measurement: any) {
      const prevData = [...data];
      // Check if current metric is selected, and if yes, set value and unit just in case
      const item = prevData.find(d => d.metric === measurement.metric);
      if (item) {
        item.unit = measurement.unit;
        item.value = measurement.value;
        setData(prevData);
      }
    },
    setMetrics(metrics: string[]) {
      const emptyData = metrics.map(metric => ({
        metric: metric,
        unit: '',
        value: 0,
      }));
      setData(emptyData);
    },
  }));

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        {data.map((d, index) => (
          <CurMeasurementWidget key={index} measurement={d} />
        ))}
      </Grid>
    </div>
  );
});
