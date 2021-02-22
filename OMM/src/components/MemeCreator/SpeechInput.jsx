import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Mic from "@material-ui/icons/Mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const useStyles = makeStyles((theme) => ({}));

const SpeechInput = (params) => {
  const [speaking, setSpeaking] = useState(false);

  const { transcript } = useSpeechRecognition();

  useEffect(() => {
    params.setCaption(transcript);
  }, [transcript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const speech = SpeechRecognition;

  const toggleSpeech = () => {
    if (speaking) {
      speech.stopListening();
    } else {
      speech.startListening({ language: "en-US" });
      //stop listening after five seconds
      setTimeout(function() {
        speech.abortListening()
        setSpeaking(false);
      }, 3000);
    }
    setSpeaking(!speaking);
  };

  return (
    <Button
      className="classes.buttonStyle modal"
      startIcon={<Mic />}
      variant="contained"
      onClick={() => toggleSpeech()}
      color={speaking ? "primary" : "secondary"}
    >
      Tell me your caption!
    </Button>
  );
};

export default SpeechInput;
