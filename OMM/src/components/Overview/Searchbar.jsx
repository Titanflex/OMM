import React, { useState } from "react";
import {
    TextField,
} from "@material-ui/core";


export default function Searchbar() {

    const [values, setValues] = useState({
        searchterm: "",
    });

    const handleChange = () => (event) => {
        setValues({ searchterm: event.target.value });
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
                    onChange={handleChange()}
                />
            </form>
        </div>
    );
}
