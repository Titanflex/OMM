import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Mic from "@material-ui/icons/Mic";
import CircularProgress from "@material-ui/core/CircularProgress";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { navigate } from "hookrouter";
import AuthService from "../../services/auth.service";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginLeft: 8,
  },
}));

const SpeechInput = (params) => {
  const classes = useStyles();
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  //using the react-speech-recognition React hook
  //for more information, see https://www.npmjs.com/package/react-speech-recognition
  const { transcript, finalTranscript } = useSpeechRecognition();

  /**
   * gets called if the finalTranscript of the speech hook was changed
   */
  useEffect(() => {
    handleSpeech();
  }, [finalTranscript]);

  /**
   * toggles if the SpeechRecognition listening / the speech input
   */
  const toggleSpeech = () => {
    console.log("Start Listening....");
    if (speaking) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ language: "en-US" });
      //if the user does not stop the speech input manually -> end it after 5 seconds
      setTimeout(function() {
        SpeechRecognition.stopListening();
        setSpeaking(false);
      }, 3000);
    }
    setSpeaking(!speaking);
  };

  /**
   * triggers the actions based on the speech transcript
   */
  const handleSpeech = () => {
    console.log(transcript);
    setLoading(false);
    switch (transcript) {
      case "navigate to overview":
        navigate("/overview");
        return;
      //the SpeechRecognition misunderstands over fuel instead of overview
      case "navigate to over fuel":
        navigate("/overview");
        return;
      case "navigate to generator":
        navigate("/");
        return;
      case "navigate to my memes":
        navigate("/my-memes");
        return;
      case "logout":
        AuthService.logout();
        window.location.reload();
        return;
      //the SpeechRecognition misunderstands look out instead of logout
      case "look out":
        AuthService.logout();
        window.location.reload();
        return;
    }
  };

  return (
    <div>
      {!loading ? (
        <IconButton
          aria-label="mic for speech input"
          onClick={toggleSpeech}
          edge="end"
          className={classes.iconButton}
          color={speaking ? "secondary" : "inherit"}
        >
          <Mic />
        </IconButton>
      ) : (
        <CircularProgress color="secondary" />
      )}
    </div>
  );
};

export default SpeechInput;
