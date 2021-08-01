import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  at: Date;
  value: number;
  unit: string;
};

export type MetricMeasurements = {
  metric: string;
  measurements: Measurement[];
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  data: [] as MetricMeasurements[]
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementsRecevied: (state, action: PayloadAction<MetricMeasurements[]>) => {
      state.data = action.payload;
    },
    measurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
