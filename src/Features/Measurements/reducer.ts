import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  metric: string;
  at: Date;
  value: number;
  unit: string;
};

export type MeasurementsForMetric = {
  metric: string;
  measurements: Measurement[];
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metric: '',
  measurements: [] as Measurement[]
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementsRecevied: (state, action: PayloadAction<MeasurementsForMetric>) => {
      state.metric = action.payload.metric;
      state.measurements = action.payload.measurements
        .filter((measurement: Measurement) => new Date(measurement.at).getSeconds() === 0)
        .map((measurement: Measurement) => ({
          ...measurement,
          at: new Date(measurement.at)
        }));
    },
    measurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
