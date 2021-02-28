import React, { useState } from "react";



import AuthService from "../../services/auth.service";
import {
  Grid,
  Typography,
  makeStyles,
  Box,
  IconButton,
} from "@material-ui/core";

import {
  Close,
} from "@material-ui/icons";

import Moment from "moment";



const useStyles = makeStyles((theme) => ({
  spacing: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    width: `${50}%`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  commentBox: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
    minWidth: `${80}%`,
    backgroundColor: theme.palette.background.paper,
    padding: `${2}%`,
    borderColor: theme.palette.primary.main,
  },

}));

const Comments = props => {

const currentMeme = props.currentMeme;

const classes = useStyles();

  /*
    The method handleDeleteCommentClick calls removeComment when the user clicks x button on his/her comment.
    */
   const handleDeleteCommentClick = (comment) => {
    console.log("delete comment");
    removeComment(comment);
    props.getUpdatedMemes();
  };

  /*
   The method removeComment pulls the comment by the user from the server.
   */
  async function removeComment(comment) {
    const currentMemeId = currentMeme._id;
    await fetch("http://localhost:3030/memeIO/remove-comment", {
      method: "POST",
      mode: "cors",
      headers: AuthService.getTokenHeader(),
      body: JSON.stringify({
        id: currentMemeId,
        commenttext: comment.commenttext,
      }),
    }).then((response) => {
      console.log(response);
    });
  }

  return (
    <Grid container spacing={1}>
        {currentMeme.hasOwnProperty("comments")
          ? currentMeme.comments.map((comment) => (
            <div
              className={classes.spacing}
              key={comment._id}
              style={{ width: "90%" }}
            >
              <Box
                border={1}
                className={classes.commentBox}
                borderRadius="borderRadius"
              >
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <Typography variant="body2">
                      Comment from{" "}
                      {comment.hasOwnProperty("user")
                        ? comment.user
                        : "Anonymous"}{" "}
                        on the{" "}
                      {comment.hasOwnProperty("date")
                        ? Moment(comment.date).format("MMM Do YY")
                        : "No date"}
                        :
                      </Typography>
                    <Typography variant="body1" className={classes.spacing}>
                      {comment.hasOwnProperty("commenttext")
                        ? comment.commenttext
                        : "No text"}
                    </Typography>
                  </Grid>

                  {comment.user === localStorage.user ? (
                    <Grid item xs container justify="flex-end">
                      <IconButton
                        onClick={() => handleDeleteCommentClick(comment)}
                        variant="contained"
                        edge="end"
                      >
                        <Close />
                      </IconButton>
                    </Grid>
                  ) : null}
                </Grid>
              </Box>
            </div>
          ))
          : null}
      </Grid>



  );
}

export default Comments;
