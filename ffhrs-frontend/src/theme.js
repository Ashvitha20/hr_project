import { createTheme } from '@mui/material/styles';

// Brand palette derived from the Future Focus HR Solutions logo and
// collateral (green + navy-blue "runner" mark, warm neutral background).
const brand = {
  green: '#5FA83D',
  greenDark: '#3F7A2A',
  blue: '#2C5A8C',
  blueDark: '#1D3E63',
  ink: '#1F2937',
  paper: '#FFFFFF',
  bg: '#F7F9F8',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.blue,
      dark: brand.blueDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brand.green,
      dark: brand.greenDark,
      contrastText: '#FFFFFF',
    },
    background: {
      default: brand.bg,
      paper: brand.paper,
    },
    text: {
      primary: brand.ink,
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 20, paddingBlock: 10 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
      },
    },
  },
});

export default theme;
export { brand };
