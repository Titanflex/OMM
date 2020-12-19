import MemeCreator from "./components/MemeCreator/MemeCreator";
import NavBar from "./components/NavBar/NavBar";
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './theme'

import "./css/global_style.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <MemeCreator/> 
    </ThemeProvider>
  );
}

export default App;
