import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: {
      lightest: blueGrey[300],
      light: blueGrey[500],
      main: blueGrey[100],
      dark: blueGrey[900],
      darkest: '#001111',
      a1: '#00333d'
    },
    secondary: {
      light: '#FF7060',
      main: '#4F2725'
    },
    black: '#000000'
  }
});

export default theme;
