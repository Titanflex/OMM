import React, { useState, useEffect, } from "react";
import {
    Grid,
    TextField,
    Container,
    makeStyles,
} from "@material-ui/core";


import MemeView from "./MemeView";
import Searchbar from "./Searchbar";

const useStyles = makeStyles((theme) => ({
    spacing: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    
}));



function MemeScrollList() {

    const [memes, setMemes] = useState([{ url: null }]);
    const [searchTerm, setSearchTerm] = useState(null);

    const classes = useStyles();

    const handleChange = () => (event) => {
        setSearchTerm(event.target.value);
        filterMemesBy();
    };

    const filterMemesByDate = () => {
        return (
            <div>
                {memes.filter(list => memes.includes('J')).map(filteredName => (
                    <li>
                        {filteredName}
                    </li>
                ))}
            </div>
        )
    }

    const sortMemesByDate = () => {
        return (
            <div>
                {memes.filter(list => memes.includes('J')).map(filteredName => (
                    <li>
                        {filteredName}
                    </li>
                ))}
            </div>
        )
    }

    const filterMemesBy = async() => {
            await fetch("http://localhost:3030/memeIO/get-memes-by/" + searchTerm, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    searchTerm: setSearchTerm,
                }),
            }).then(res => {
                
            res.json().then(json => {
                    setMemes(json.docs);
                    console.log(json.docs)
                    return json;
                })
            })
        ;
    }

    const sortMemesByVote = () => {
        return (
            <div>
                {memes.sort(list => memes.includes('J')).map(filteredName => (
                    <li>
                        {filteredName}
                    </li>
                ))}
            </div>
        )
    }

    const ListMemes = ({ listmemes }) => {
        return (
            <Grid container spacing={1}>
                {
                    listmemes.map((meme) => (
                        //<Grid container key={meme._id} onClick={() => window.open(`/singleview/${meme._id}`, "_self")}>
                            <MemeView memeInfo={meme} key={meme._id} />
                    ))}
            </Grid>
        )
    };

    // useEffect for componentDidMount
    // see: https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        const loadMemes = async () => {
            await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
                res.json().then(json => {
                    setMemes(json.docs);
                    console.log(json.docs)
                    return json;
                })
            })
        };
        loadMemes();
    }, []);


    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs></Grid>
                <Grid item xs={4}>
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
        </Grid>
                <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={1}>
                <ListMemes className={classes.spacing} listmemes={memes} />
            </Grid>
        </Container>
    );
}


export default MemeScrollList;