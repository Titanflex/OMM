import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { makeStyles } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import Mic from "@material-ui/icons/Mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const useStyles = makeStyles((theme) => ({}));

const SpeechInputField = forwardRef((params, ref) => {
  const [value, setValue] = useState(params.value);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const classes = useStyles();

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    setValue(transcript);
    params.setValue(transcript);
    setError(null);
  }, [transcript]);

  useImperativeHandle(ref, () => ({
    setError() {
      setError("Pleaser enter a " + params.label);
    },
  }));

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const toggleSpeech = () => {
    if (speaking) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ language: "en-US" });
      //stop listening after five seconds
      setTimeout(function() {
        SpeechRecognition.stopListening();
        setSpeaking(false);
      }, 3000);
    }
    setSpeaking(!speaking);
  };

  const handleInput = (event) => {
    setError(null);
    setValue(event.target.value);
    params.setValue(event.target.value);
  };

  return (
    <FormControl className={classes.spacing} variant="outlined" fullWidth>
      <InputLabel>{params.label}</InputLabel>
      <OutlinedInput
        id="meme-title"
        fullWidth
        type="text"
        value={value}
        error={error}
        onChange={(event) => handleInput(event)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="mic for speech input"
              onClick={toggleSpeech}
              edge="end"
              color={speaking ? "primary" : "secondary"}
            >
              <Mic />
            </IconButton>
          </InputAdornment>
        }
        labelWidth={70}
      />
      {<FormHelperText error={error}>{error}</FormHelperText>}
    </FormControl>
  );
});

export default SpeechInputField;
