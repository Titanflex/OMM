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
  const [waitForResponse, setWaitForResponse] = useState(false);

  const { transcript, finalTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (waitForResponse) {
      params.setCaption(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (waitForResponse) {
      console.log("final caption: " + finalTranscript);
      params.setCaption(finalTranscript);
      setWaitForResponse(false);
    }
  }, [finalTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const speech = SpeechRecognition;

  const toggleSpeech = () => {
    if (speaking) {
      speech.stopListening();
    } else {
      speech.startListening({ language: "en-US" });
      console.log("Start Listening the Caption")
      setWaitForResponse(true);
      //stop listening after five seconds
      setTimeout(function() {
        speech.stopListening();
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
