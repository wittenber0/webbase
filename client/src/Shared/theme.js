import { createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createTheme({
  palette: {
    mode: 'dark',
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
      two: '#141414',
      three: '#303030',
      four: '#505050'
    },
    light: '#f2f2f2',
    typography: {
      TextField: {
        color: '#FFFFFF'
      }
    },
    divider: '#202020'
  }
});

export default theme;
