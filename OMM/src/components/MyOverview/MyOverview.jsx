import React, { useState, useEffect } from "react";
import { Grid, Container, makeStyles, Button } from "@material-ui/core";
import { navigate } from "hookrouter";

import MemeView from "../Overview/MemeView";

import Filter from "../Overview/Filter";
import emptyState from "../../img/emptyState.jpg";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./../../css/Overview/myoverview.css";

const useStyles = makeStyles((theme) => ({
  spacing: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
  },
  selectEmpty: {
      marginTop: theme.spacing(2),
  },
      
      formControl: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
      },
      paper: {
        position: "absolute",
        width: `${50}%`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      numberField: {
        width: `${15}%`,
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
      },
      filterButton: {
        height: `${70}%`,
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
      },
    

}));

function MyOverview() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const classes = useStyles();

  /**
   * is called on mount -> load memes and set loading to true
   */
  useEffect(() => {
    setLoading(true);
    loadMemes();
  }, []);

  /**
   *
   * @param {array} listmemes array of the filtered memes to be shown
   * @return {<Grid>} returns the listesmemes as MemeView inside Grid
   */
  const ListMemes = ({ listmemes }) => {
    return (
      <Grid container spacing={1}>
        {listmemes.map((meme) => (
          <MemeView memeInfo={meme} getUpdatedMemes={loadMemes} key={meme._id} />
        ))}
      </Grid>
    );
  };

  /**
   * loads the memes and filters them by the currently logged in user
   */
  const loadMemes = async () => {
    await fetch("http://localhost:3030/memeIO/get-memes").then((res) => {
      res.json().then((json) => {
        let fetchedMemes = json.docs;
        let myMemes = fetchedMemes.filter(function(meme) {
          return meme.author && meme.author == localStorage.user;
        });
        setMemes(myMemes);
        //set loading false if the memes were loaded
        setLoading(false);
        return myMemes;
      });
    });
  };

  return (
    <div>
      {/* if loading only show loading circle, otherwise show the Meme Scroll List */}
      {!loading ? (
        <Container className="memeScrollListContainer">
          {/* if the the user has not created any memes yet -> show the empty state, otherwise show the Meme Scroll List */}
          {memes.length > 0 ? (
            <Grid container spacing={1}>
              <ListMemes className={classes.spacing} listmemes={memes} />
            </Grid>
          ) : (
            <div class="empty-state">
              <img src={emptyState} />
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/");
                }}
                color="secondary"
              >
                Create Meme
              </Button>
            </div>
          )}
        </Container>
      ) : (
        // Loading Circle
        <div classNa me="loading">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default MyOverview;
