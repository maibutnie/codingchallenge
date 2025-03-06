import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import './App.css'
import MainPage from './pages/MainPage'

localStorage.removeItem("theme");

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <MainPage />
    </ThemeProvider>
  )
}

export default App
