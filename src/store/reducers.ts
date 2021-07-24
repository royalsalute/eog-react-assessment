import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as measurementsReducer } from '../Features/Measurements/reducer';
import { reducer as curMeasurementReducer } from '../Features/CurMeasurement/reducer';

export default {
  weather: weatherReducer,
  measurements: measurementsReducer,
  curMeasurement: curMeasurementReducer
};

