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
    typography: {
        h3: {
            color: "#FFFF"
        },
        h6: {
            color: "#FFFF"
        },
        subtitle1: {
            color: "#FFFF",
        },
        h4: {
            textAlign: 'center'
        }
    },
    overrides: {
        MuiButton: {
            raisedPrimary: {
                color: 'white',
            },
        },
        MuiToggleButton: {
            raisedPrimary: {
                backgroundColor: '#333333',
                color: 'white',
            },
            
            // Override the styling for selected toggle buttons
            root: {
               

              '&$selected': {
                backgroundColor: "#1BBAB0", // Greenish
                color: 'white',
              }
            },
        },
    }
    
});


export default theme