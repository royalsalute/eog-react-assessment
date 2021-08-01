import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useQuery, useMutation, useSubscription } from 'urql';
import { actions as measurementsActions } from '../Features/Measurements/reducer';
import { actions as curMeasurementActions } from '../Features/CurMeasurement/reducer';
import HistoricalMeasurements from './HistoricalMeasurements';
import ChooseMetrics from './ChooseMetrics';
import CurrentMeasurement from './CurrentMeasurement';

const useStyles = makeStyles({
  card: {
    margin: '5% 25%',
  },
  select: {
    width: 200,
  },
});

const metricsQuery = `
query {
  getMetrics 
}
`;

const measurementsQuery = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      unit
    }
  }
}
`;

const newMeasurement = `
  subscription {
    newMeasurement {
      metric,
      at,
      value,
      unit
    }
  }
`;


export default () => {
  const classes = useStyles();

  const curMeasurementRef = useRef<any>(null);
  const historicChartRef = useRef<any>(null);

  const dispatch = useDispatch();
  const [allMetrics, setAllMetrics] = useState<string[]>([]);
  const [selMetrics, setSelMetrics] = useState<string[]>([]);

  const [metricsResult] = useQuery({
    query: metricsQuery,
  });
  const [measurementsResult, executeFetchMeasurements] = useMutation(measurementsQuery);

  // Subscription for graphql
  const [res] = useSubscription({ query: newMeasurement }, (measurements: any[] = [], response: any) => {
    const {newMeasurement: measurement} = response;
    if (curMeasurementRef && curMeasurementRef.current) {
      curMeasurementRef.current.onNewMeasurement(measurement);
    }
    if (historicChartRef && historicChartRef.current) {
      historicChartRef.current.onNewMeasurement(measurement);
    }
    return [response.newMeasurement];
  });

  useEffect(() => {
    if (metricsResult.data) {
      setAllMetrics(metricsResult.data.getMetrics);
    }
  }, [dispatch, metricsResult.data, metricsResult.error]);

  const getMultipleMeasurements = (metrics: any[]) => {
    let after = new Date();
    after.setMinutes(after.getMinutes() - 30);

    executeFetchMeasurements({
      input: metrics.map(metric => ({ metricName: metric, after: after.getTime() })),
    })
      .then(response => {
        const { getMultipleMeasurements } = response.data;
        dispatch(measurementsActions.measurementsRecevied(getMultipleMeasurements));
      })
      .catch(error => {
        if (error) {
          dispatch(measurementsActions.measurementApiErrorReceived({ error: error.message }));
          return;
        }
      });
  };

  const onSelectMetrics = (metrics: string[]) => {
    getMultipleMeasurements(metrics);
    setSelMetrics(metrics);
    if (curMeasurementRef && curMeasurementRef.current) {
      curMeasurementRef.current.setMetrics(metrics);
    }
  };

  return (
    <Card className={classes.card}>
      <CardHeader title="OK, Michael Jin, you're all setup. Now What?" />
      <CardContent>
        <ChooseMetrics metricOptions={allMetrics} onSelect={onSelectMetrics} />
        <CurrentMeasurement ref={curMeasurementRef} />
        <HistoricalMeasurements ref={historicChartRef} />
      </CardContent>
    </Card>
  );
};
