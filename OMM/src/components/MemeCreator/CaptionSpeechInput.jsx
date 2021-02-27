import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Mic from "@material-ui/icons/Mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import "./../../css/MemeCreator/speechInput.css";

const SpeechInput = (params) => {
  const [speaking, setSpeaking] = useState(false);
  const [waitForResponse, setWaitForResponse] = useState(false);

  //using the react-speech-recognition React hook
  //for more information, see https://www.npmjs.com/package/react-speech-recognition
  const { transcript, finalTranscript } = useSpeechRecognition();
  /**
   * gets called if the transcript of the SpeechRecognition changes -> understands something the user is saying
   */
  useEffect(() => {
    //only when this component is actively waiting for a response set the caption
    if (waitForResponse) {
      params.setCaption(transcript);
    }
  }, [transcript]);

  /**
   * gets called if the finalTranscript of the speech hook was changed -> sets the caption to the final transcript
   */
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


  /**
   * toggles if the SpeechRecognition listening / the speech input
   */
  const toggleSpeech = () => {
    if (speaking) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ language: "en-US" });
      setWaitForResponse(true);
      //if the user does not stop the speech input manually -> end it after 5 seconds
      setTimeout(function() {
        SpeechRecognition.stopListening();
        setSpeaking(false);
      }, 3000);
    }
    setSpeaking(!speaking);
  };

  return (
    <Button
      className="classes.buttonStyle button modal"
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
