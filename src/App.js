import { useState } from 'react';
import { useStyles } from './styles/styles';
import {
  Fab,
  Select,
  InputLabel,
  MenuItem,
  Grid,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControl,
  FormControlLabel,
  Button,
  Card,
  IconButton
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import './App.css';

function App() {
  const savedState = JSON.parse(localStorage.getItem('fieldBuilderState')) || {};
  const classes = useStyles();
  const [ label, setLabel ] = useState(savedState.label || '');
  const [ mode, setMode ] = useState(savedState.mode || 'multi');
  const [ required, setRequired ] = useState(savedState.required || 'false');
  const [ defaultValue, setDefaultValue ] = useState(savedState.defaultValue || '');
  const [ choices, setChoices ] = useState(savedState.choices || []);
  const [ displayOrder, setDisplayOrder ] = useState(savedState.displayOrder || 'alphabetical');
  const [ newChoice, setNewChoice ] = useState('');
  const [ newChoiceError, setnewChoiceError ] = useState('');
  const [ labelError, setLabelError ] = useState('');

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleNewChoiceChange = (e) => {
    setnewChoiceError('');
    setNewChoice(e.target.value);
  };

  const handleNewChoiceChangeKey = (e) => {
    if (e.code === 'Enter') {
      addChoice();
    }
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleRequiredChange = (e) => {
    setRequired(e.target.checked);
  };

  const resetNewChoiceError = (delay = 2000) => {
    setTimeout(() => setnewChoiceError(''), delay);
  };

  const addChoice = () => {
    const choice = newChoice.trim();
    if (choices.length >= 50) {
      setnewChoiceError('Reached maximum number of choices');
      return resetNewChoiceError();
    }

    if (choice.length >= 40) {
      setnewChoiceError('Maximum length is 40 characters');
      return resetNewChoiceError();
    }

    if (choice) {
      if (!choices.includes(choice)) {
        setChoices([ ...choices, choice ]);
        setNewChoice('');
      } else {
        setnewChoiceError('This choice already exists');
        return resetNewChoiceError();
      }
    }
  };

  const removeChoice = (choiceToRemove) => {
    if (choices.includes(choiceToRemove)) {
      setChoices(choices.filter((choiceItem) => choiceItem !== choiceToRemove));
    }
  };

  const handleDefaultValueChange = (e) => {
    setDefaultValue(e.target.value);
  };
  const handleOrderChange = (e) => {
    setDisplayOrder(e.target.value);
  };

  const handleCancel = () => {
    setLabel('');
    setMode('multi');
    setRequired('false');
    setDefaultValue('');
    setChoices([]);
    setDisplayOrder('alphabetical');
    setNewChoice('');
    setnewChoiceError('');
    setLabelError('');
  };

  const handleSave = () => {
    if (!label.trim()) {
      setLabelError('Field is required');
      setTimeout(() => setLabelError(''), 2000);
    }
    if (!choices.includes(defaultValue.trim())) {
      setChoices([ ...choices, defaultValue.trim() ]);
    }

    fetch('http://www.mocky.io/v2/566061f21200008e3aabd919', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stateToJson())
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject('something went wrong!');
        }
      })
      .then((data) => console.log('API response:', data))
      .catch((error) => console.error('Error:', error));

    console.log('JSON string:', stateToJson());
  };

  const stateToJson = () => JSON.stringify({ label, required, choices, displayOrder, defaultValue });

  localStorage.setItem('fieldBuilderState', stateToJson());

  const renderedChoices = choices.map((choice) => (
    <Grid container alignItems="center" style={{ margin: 0 }} key={choice}>
      <Grid item xs={10}>
        {choice}
      </Grid>
      <Grid item xs={2}>
        <IconButton onClick={() => removeChoice(choice)}>
          <DeleteIcon />{' '}
        </IconButton>{' '}
      </Grid>
    </Grid>
  ));

  return (
    <div className="App">
      <Grid container justify="flex-start" alignItems="center">
        <Grid item xs={null} sm={1} md={2} lg={3} xl={4} />
        <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
          <Paper className={classes.paper}>
            <Typography variant="h2" color="primary" gutterBottom>
              Field Builder
            </Typography>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Grid item xs={12} className={classes.formRow}>
                  <FormControl>
                    <TextField
                      label="Label"
                      className={classes.input}
                      value={label}
                      onChange={handleLabelChange}
                      error={labelError.length > 0}
                      helperText={labelError}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} className={classes.formRow}>
                  <FormControl>
                    <InputLabel id="select-variant-label">Mode</InputLabel>
                    <Select
                      id="select-variant-select"
                      labelId="select-variant-label"
                      displayEmpty
                      className={classes.input}
                      onChange={handleModeChange}
                      value={mode}
                    >
                      <MenuItem value={'multi'}>Multi-select</MenuItem>
                      <MenuItem value={'single'}>Single-select</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} className={classes.formRow}>
                  <FormControlLabel
                    control={<Checkbox name="checkedA" onChange={handleRequiredChange} color="primary" />}
                    label="A value is required"
                  />
                </Grid>
                <Grid item xs={12} className={classes.formRow}>
                  <FormControl>
                    <TextField
                      label="Default Value"
                      className={classes.input}
                      value={defaultValue}
                      onChange={handleDefaultValueChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.formRow}>
                  <FormControl disabled>
                    <InputLabel id="select-order-label">Order</InputLabel>
                    <Select
                      id="select-order-select"
                      labelId="select-order-label"
                      displayEmpty
                      className={classes.input}
                      onChange={handleOrderChange}
                      value={displayOrder}
                    >
                      <MenuItem value={'alphabetical'}>Alphabetical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={12} className={classes.formRow}>
                    <FormControl>
                      <TextField
                        label="Add New Choice"
                        className={classes.input}
                        value={newChoice}
                        onChange={handleNewChoiceChange}
                        onKeyPress={handleNewChoiceChangeKey}
                        error={newChoiceError.length > 0}
                        helperText={newChoiceError}
                      />
                    </FormControl>
                    <Fab color="secondary" onClick={addChoice}>
                      <AddIcon />
                    </Fab>
                  </Grid>
                  {choices.length > 0 && (
                    <Grid item xs={12} className={classes.formRow}>
                      <Typography variant="caption" display="block" gutterBottom>
                        Choices
                      </Typography>

                      <Card variant="outlined" className={classes.choicesCard}>
                        {renderedChoices}
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.formRow}>
                <Grid container justify="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button variant="text" size="large" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={null} sm={1} md={2} lg={3} xl={4} />
      </Grid>
    </div>
  );
}

export default App;
