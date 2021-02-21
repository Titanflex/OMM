import React, { useState, useEffect, } from "react";
import {
    Grid,
    Container,
    makeStyles,
    Button

} from "@material-ui/core";
import { navigate } from "hookrouter";

import MemeView from '../Overview/MemeView'
import emptyState from '../../img/emptyState.jpg'

import "./../../css/Overview/myoverview.css";


const useStyles = makeStyles((theme) => ({
    spacing: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
    
}));


function MyOverview() {

    const [memes, setMemes] = useState([]);

    const classes = useStyles();


    useEffect(() => {     
        loadMemes();
    }, []);

    const ListMemes = ({ listmemes }) => {
        return (
            <Grid container spacing={1}>
                {
                    listmemes.map((meme) => (
                                              <MemeView memeInfo={meme} key={meme._id} />
                    ))}
            </Grid>
        )
    };


    const loadMemes = async () => {
        await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
            res.json().then(json => {
                let fetchedMemes = json.docs;
                let myMemes = fetchedMemes.filter(function(meme) {
                    return (meme.author && meme.author == localStorage.user);
                })
                setMemes(myMemes);
                return myMemes;
            })
        })
    };


    return (
        <Container className="memeScrollListContainer" >
           {memes.length > 0 ? <Grid container spacing={1}>
                <ListMemes className={classes.spacing} listmemes={memes} />
            </Grid> : <div class="empty-state">
                <img src ={emptyState}/>
                <Button
                  variant="contained"
                  onClick={() => { navigate("/") }}
                  color="secondary"
                >
                  Create Meme

       </Button></div>} 
        </Container>
    );
}


export default MyOverview;