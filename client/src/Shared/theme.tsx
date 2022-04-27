//import { createTheme } from '@material-ui/core/styles';
import { createTheme } from '@mui/material/styles'
import { darken } from '@material-ui/core/styles';
const main = '#4466ff'

declare module '@mui/material/styles' {
  interface PaletteOptions {    
      dark?: any,
      light?: any,
      typography?: any
  }
}

declare module '@mui/material/styles' {
  interface Palette {    
      dark?: any,
      light?: any,
      typography?: any
  }
}

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
