import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IState } from '../store';

const COLORS = ['#FA5E1F', '#FDCB3F', '#71D743', '#D23333', '#BAE73F', '#B381C9'];

type Metric = {
  metricName: string;
  unit: string;
};

export default forwardRef((props, ref) => {
  const historicData = useSelector((state: IState) => state.measurements);
  const [metricUnits, setMetricUnits] = useState([] as string[]);
  const [metrics, setMetrics] = useState([] as Metric[]);
  const [data, setData] = useState([] as any[]);

  useImperativeHandle(ref, () => ({
    onNewMeasurement(measurement: any) {
      // Check if current metric is selected. If not, just return
      if (!metrics.find(metric => metric.metricName === measurement.metric)) return;

      const prevData = [...data];
      // Find existing measurement at current timestamp
      const item = prevData.find(d => d.at.getTime() === measurement.at);
      // If exists, just set metric value
      if (item) {
        item[measurement.metric] = measurement.value;
      } else { // If not, add new measurement at current timestamp
        prevData.push({
          at: new Date(measurement.at),
          [measurement.metric]: measurement.value,
        });
        prevData.shift();
      }
      setData(prevData);
    },
  }));

  useEffect(() => {
    const units = [] as string[];
    const history: any[] = [];
    const metricData: Metric[] = [];

    const { data } = historicData;
    if (data.length === 0) {
      return;
    }

    // Get the minimum length among all metric data
    const len = Math.min.apply(null, data.map(measurements => measurements.measurements.length));

    // Convert graphql data to chart data format
    for (let i = 0; i < data.length; i++) {
      metricData.push({
        metricName: data[i].metric,
        unit: data[i].measurements.length > 0 ? data[i].measurements[0].unit : '',
      });
    }

    for (let i = 0; i < data.length; i++) {
      if (!units.find(unit => unit === metricData[i].unit)) {
        units.push(metricData[i].unit);
      }
    }

    for (let i = 0; i < len; i++) {
      const item: any = {};
      for (let j = 0; j < data.length; j++) {
        if (j === 0) {
          item.at = new Date(data[j].measurements[i].at);
        }
        item[data[j].metric] = data[j].measurements[i].value;
      }
      history.push(item);
    }

    setData(history);
    setMetricUnits(units);
    setMetrics(metricData);
  }, [historicData]);
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="at" tickFormatter={(at: Date) => moment(at).format('HH:mm')} />
          {metricUnits.map(unit => (
            <YAxis key={unit} yAxisId={unit} unit={unit} />
          ))}
          <Tooltip />
          <Legend verticalAlign="top" height={48} />
          {metrics.map((metric, index) => (
            <Line
              yAxisId={metric.unit}
              key={metric.metricName}
              name={metric.metricName}
              type="linear"
              dataKey={metric.metricName}
              dot={false}
              stroke={COLORS[index]}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
