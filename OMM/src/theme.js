import { createMuiTheme } from "@material-ui/core";

//the material ui theme is defined here -> define here global colors and font styles
const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#1BBAB0", // Greenish
        },
        secondary: {
            main: "#333333" // Grey
        }
    },
});

export default theme