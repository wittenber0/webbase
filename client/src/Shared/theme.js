import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500]
    },
    secondary: {
      light: '#FF7060',
      main: '#000000'
    },
    black: '#000000',
    dark: {
      one: '#101010',
      two: '#181818',
      three: '#303030'
    },
    light: '#f2f2f2'
  }
});

export default theme;
