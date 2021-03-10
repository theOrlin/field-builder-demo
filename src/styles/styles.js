import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: 30
  },
  choicesCard: {
    padding: '10px 20px'
  },
  title: {
    flexGrow: 1,
    padding: '15px 20px'
  },
  input: {
    width: '200px'
  },
  variantSelect: {
    minWidth: 120
  },
  formRow: {
    padding: '10px 0'
  }
}));
