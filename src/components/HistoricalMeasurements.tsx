import React, {  } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IState } from '../store';

export default () => {
  const metricMeasurements = useSelector((state: IState) => state.measurements);
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={metricMeasurements.measurements}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="at" tickFormatter={(at: Date) => moment(at).format('HH:mm')} />
          <YAxis unit={metricMeasurements.measurements.length > 0 ? metricMeasurements.measurements[0].unit : ''} />
          <Tooltip />
          <Legend />
          <Line name={metricMeasurements.metric} type="linear" dataKey="value" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
