import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Mic from "@material-ui/icons/Mic";
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

/**
 * Creates and handles the speech input.
 */
const SpeechInput = () => {
  const classes = useStyles();

  //using the react-speech-recognition React hook
  //for more information, see https://www.npmjs.com/package/react-speech-recognition
  const { transcript, finalTranscript, listening } = useSpeechRecognition();

  /**
   * gets called if the finalTranscript of the speech hook was changed
   */
  useEffect(handleSpeech, [finalTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log("No Speech Support because of your Browser, please use Chrome!")
    return null;
  }

  /**
   * toggles if the SpeechRecognition listening / the speech input
   */
  const toggleSpeech = () => {
    console.log("Start Listening....");
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ language: "en-US" });
      //if the user does not stop the speech input manually -> end it after 5 seconds
      setTimeout(function () {
        SpeechRecognition.stopListening();
      }, 3000);
    }
  };

  /**
   * triggers the actions based on the speech transcript
   */
  function handleSpeech() {
    console.log(transcript);
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
      case "navigate to motion generator":
        navigate("/videoGen");
        return;
      case "navigate to my memes":
        navigate("/my-memes");
        return;
      case "navigate to my niecenavigate to my niece":
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
      <IconButton
        aria-label="mic for speech input"
        onClick={() => toggleSpeech()}
        edge="end"
        className={classes.iconButton}
        color={listening ? "secondary" : "inherit"}
      >
        <Mic />
      </IconButton>
    </div>
  );
};

export default SpeechInput;
