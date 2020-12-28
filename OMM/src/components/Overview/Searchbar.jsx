import React, { useState } from "react";
import {
    Typography,
    Button,
    TextField,
    FormControl,
    OutlinedInput,
    IconButton,
    InputLabel,
    InputAdornment,
    makeStyles,
} from "@material-ui/core";
import { navigate } from "hookrouter";


export default function Searchbar() {

    const [values, setValues] = useState({
        searchterm: "",
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const search = () => {
        navigate("/overview");
        window.location.reload();
    };

    return (
        <div className="search-container">
            <form>
                <TextField
                    className="SearchTextField"
                    id="search"
                    label="Search Meme"
                    placeholder="Search Meme"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
            </form>
        </div>
    );
}
