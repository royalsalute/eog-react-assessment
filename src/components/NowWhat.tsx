import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from 'urql';
import { actions as measurementsActions } from '../Features/Measurements/reducer';
import { actions as curMeasurementActions } from '../Features/CurMeasurement/reducer';
import HistoricalMeasurements from './HistoricalMeasurements';
import CurrentMeasurement from './CurrentMeasurement';
import { Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    margin: '5% 25%',
  },
  select: {
    width: 200,
  },
  selectContainer: {
    marginBottom: 30,
  },
});

const metricsQuery = `
query {
  getMetrics 
}
`;

const measurementsQuery = `
query($input: MeasurementQuery!) {
  getMeasurements(input: $input) {
    metric
    at
    value
    unit
  }
}
`;

const curMeasurementQuery = `
query ($metricName: String!) {
  getLastKnownMeasurement(metricName: $metricName) {
    metric
    at
    value
    unit
  }
}
`;

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [metrics, setMetrics] = useState([]);
  const [metric, setMetric] = useState('');

  const [metricsResult] = useQuery({
    query: metricsQuery,
  });
  const [measurementsResult, executeFetchMeasurements] = useMutation(measurementsQuery);
  const [curMeasurementResult, executeFetchCurMeasurement] = useMutation(curMeasurementQuery);

  useEffect(() => {
    if (metricsResult.data) {
      setMetrics(metricsResult.data.getMetrics);
    }
  }, [dispatch, metricsResult.data, metricsResult.error]);

  const getMeasurements = () => {
    executeFetchMeasurements({
      input: {
        metricName: metric,
      },
    })
      .then(response => {
        const { getMeasurements } = response.data;
        dispatch(
          measurementsActions.measurementsRecevied({
            metric: metric,
            measurements: getMeasurements,
          }),
        );
      })
      .catch(error => {
        if (error) {
          dispatch(measurementsActions.measurementApiErrorReceived({ error: error.message }));
          return;
        }
      });

    executeFetchCurMeasurement({
      metricName: metric,
    })
      .then(response => {
        const { getLastKnownMeasurement: data } = response.data;
        dispatch(curMeasurementActions.curMeasurementRecevied(data));
      })
      .catch(error => {
        if (error) {
          dispatch(curMeasurementActions.curMeasurementApiErrorReceived({ error: error.message }));
          return;
        }
      });
  };

  const handleChange = (event: any) => {
    setMetric(event.target.value);
  };

  return (
    <Card className={classes.card}>
      <CardHeader title="OK, Michael Jin, you're all setup. Now What?" />
      <CardContent>
        <Grid container spacing={2} alignItems="center" className={classes.selectContainer}>
          <Grid item>
            <TextField select className={classes.select} onChange={handleChange}>
              {metrics.map((m: string) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                getMeasurements();
              }}
            >
              Select
            </Button>
          </Grid>
        </Grid>
        <CurrentMeasurement />
        <HistoricalMeasurements />
      </CardContent>
    </Card>
  );
};
