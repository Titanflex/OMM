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

  const { transcript, finalTranscript } = useSpeechRecognition();


  useEffect(() => {
    console.log("final transcript  " + finalTranscript)
    stopListening();
  }, [finalTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const speech = SpeechRecognition;

  const toggleSpeech = () => {
    console.log("Start Listening....");
    if (speaking) {
      speech.stopListening();
      //setLoading(true);
    } else {
      speech.startListening({ language: "en-US" });
      //stop listening after five seconds
      setTimeout(function() {
        speech.stopListening();
        //setLoading(true);
        setSpeaking(false);
      }, 3000);
    }
    setSpeaking(!speaking);
  };

  const stopListening = () => {
      console.log(transcript);
      setLoading(false);
      switch (transcript) {
        case "navigate to overview":
          navigate("/overview");
          return;
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
          case "look out":
            AuthService.logout();
            window.location.reload();
            return;
      }
  };

  return (
    <div>
    {!loading ? <IconButton
      aria-label="mic for speech input"
      onClick={toggleSpeech}
      edge="end"
      className={classes.iconButton}
      color={speaking ? "secondary" : "inherit"}
    >
      <Mic />
    </IconButton> : <CircularProgress color="secondary" /> }
    </div>
  );
};

export default SpeechInput;
