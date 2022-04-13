//import { createTheme } from '@material-ui/core/styles';
import { createTheme } from '@mui/material/styles'
import { darken } from '@material-ui/core/styles';
const main = '#4466ff'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: main
    },
    secondary: {
      light: '#FF7060',
      main: '#cc9944'
    },
    black: '#000000',
    dark: {
      one: '#101010',
      two: '#151515',
      three: '#202020',
      four: darken(main, 0.7),
      five: darken(main, 0.5)
    },
    light: '#f2f2f2',
    typography: {
      h6: {
        color: '#FFFFFF'
      }
    },
    text: {
      primary: '#ffffff'
    }
  },
  components: {
    // Name of the component

  },
});

export default theme;
