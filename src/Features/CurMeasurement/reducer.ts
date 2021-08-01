import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Measurement } from '../Measurements/reducer';

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metric: '',
  at: new Date(),
  value: 0.0,
  unit: '',
};

const slice = createSlice({
  name: 'curMeasurement',
  initialState,
  reducers: {
    curMeasurementRecevied: (state, action: PayloadAction<Measurement>) => {
      const { at, value, unit } = action.payload;
      state.at = at;
      state.value = value;
      state.unit = unit;
    },
    curMeasurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
