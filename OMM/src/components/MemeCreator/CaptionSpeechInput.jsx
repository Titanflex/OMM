import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Mic from "@material-ui/icons/Mic";
import { useSpeechRecognition } from "react-speech-kit";

import "./../../css/MemeCreator/speechInput.css";

const SpeechInput = (params) => {
  const [value, setValue] = useState("");
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
    },
  });

  //using the react-speech-kit 
  //for more information, see https://www.npmjs.com/package/react-speech-kit#usespeechrecognition
  /**
   * gets called if the value of the speechRecognition changes -> understands something the user is saying
   */
  useEffect(() => {
    //send caption to the parent 
    params.setCaption(value);
  }, [value]);


  /**
   * toggles the speech recognition listening
   */
  const toggleCaptionSpeech = () => {
    if (listening) {
      stop();
    } else {
      console.log("Start Listening for the Caption...");
      listen();
      //if the user does not stop the speech input manually -> end it after 5 seconds
      setTimeout(function() {
        stop();
      }, 3000);
    }
  };

  return (
    <Button
      className="classes.buttonStyle button modal"
      startIcon={<Mic />}
      variant="contained"
      color={listening ? "primary" : "secondary"}
      onClick={() => toggleCaptionSpeech()}
    >
      Tell me your caption!
    </Button>
  );
};

export default SpeechInput;
