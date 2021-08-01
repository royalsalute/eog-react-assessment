import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  selectContainer: {
    marginBottom: 30,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

function getStyles(metric: string, metrics: string[], theme: Theme) {
  return {
    fontWeight: metrics.indexOf(metric) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

type CompProps = {
  metricOptions: string[];
  onSelect: (metrics: string[]) => void
};

export default ({ metricOptions, onSelect }: CompProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const [metrics, setMetrics] = useState<string[]>([]);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMetrics(event.target.value as string[]);
  };

  return (
    <Grid container spacing={2} alignItems="center" className={classes.selectContainer}>
      <Grid item>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={metrics}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          style={{ minWidth: 200 }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
              },
            },
          }}
          placeholder="Choose metrics"
        >
          {metricOptions.map((metric: string) => (
            <MenuItem key={metric} value={metric} style={getStyles(metric, metricOptions, theme)}>
              {metric}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (metrics.length === 0) {
              alert("Please select one or more metrics.");
              return;
            }
            onSelect(metrics);
          }}
        >
          Select
        </Button>
      </Grid>
    </Grid>
  );
};
