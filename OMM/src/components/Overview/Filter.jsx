import React, { useState } from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import {
  Button,
  Typography,
  TextField,
  makeStyles,
  Select,
  FormControl,
  InputLabel,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";


import Moment from "moment";




//create Styles
function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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

  numberField: {
    width: `${15}%`,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
 

}));

const Filter = props => {
  const memes = props.memes;
  const [isFilteredByVote, setIsFilteredByVote] = useState(false);
  const [voteNumber, setVoteNumber] = useState(null);
  const [voteEquals, setVoteEquals] = useState("equals");

  const [isFilteredByCreationDate, setIsFilteredByCreationDate] = useState(
    false
  );
  const [filterDateFrom, setFilterDateFrom] = useState(new Date());
  const [filterDateTill, setFilterDateTill] = useState(new Date());

  const [isFilteredByFileFormat, setIsFilteredByFileFormat] = useState(false);
  const [fileFormatOpt, setfileFormatOpt] = useState("png");


  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);




  /*Filter*/
  /*
    The method handleFilterVoteChange is called when the user checks the Vote checkbox in the filter modal.
    It then sets selected vote number to the operand as string.
    */
  const handleFilterVoteChange = (event) => {
    setVoteEquals(event.target.value);
  };

  /*
    The method handleFilterFileFormatChange is called when the user checks the File Format checkbox in the filter modal.
    It then sets selected vote number to the file format as string.
    */
  const handleFilterFileFormatChange = (event) => {
    setfileFormatOpt(event.target.value);
  };

  /*
    The method filterMemes is called when the user clicks "Apply" and submits the filter criteria.
    It closes the modal.
    Based on the selected filter checkbox it calls the appropiate filter method.
    */
  const filterMemes = () => {
    handleModuleClose();
    console.log(memes);

    if (isFilteredByVote) {
      filterMemesByVote();
    }
    if (isFilteredByCreationDate) {
      filterMemesByDate();
    }
    if (isFilteredByFileFormat) {
      filterMemesByFileFormat();
    }
  };

  /*
    The method filterMemesByDate takes the two date criteria of the filtermodal.
    Based on the selected dates it filters the memes.
    It updates Memes by the filltered list and sets the index to the first image.
    When no meme fulfills the filter criteria the snackbar with a warning is opened and the memes is not updated.
    */
  const filterMemesByDate = () => {
    let filteredList = [];
    if (
      filterDateFrom &&
      filterDateTill &&
      Moment(filterDateTill) > Moment(filterDateFrom)
    ) {
      filteredList = memes.filter(
        (meme) => Moment(meme.creationDate) >= Moment(filterDateFrom)
      );
      filteredList = filteredList.filter(
        (meme) => Moment(meme.creationDate) <= Moment(filterDateTill)
      );
    } else if (filterDateFrom) {
      filteredList = memes.filter(
        (meme) => Moment(meme.creationDate) >= Moment(filterDateFrom)
      );
    } else if (filterDateTill) {
      filteredList = memes.filter(
        (meme) => Moment(meme.creationDate) <= Moment(filterDateTill)
      );
    }
    if (filteredList.length === 0) {
      props.handleOpenSnack();
      console.log("no memes");
      return;
    }

    props.setMemes(filteredList);
    if (props.setCurrentMemeIndex ? props.setCurrentMemeIndex(0) : null);
  };

  /*
   The method filterMemesByFileFormat takes the selected file format.
   It checks if the selected file format is included in the url and filters memes by that.
   It updates Memes by the filltered list and sets the index to the first image.
   When no meme fulfills the filter criteria the snackbar with a warning is opened and the memes is not updated.
   */
  const filterMemesByFileFormat = () => {
    let filteredList = [];
    console.log(fileFormatOpt);
    if (fileFormatOpt === "jpg") {
      filteredList = memes.filter((meme) => meme.url.includes("jpg"));
    } else if (fileFormatOpt === "png") {
      filteredList = memes.filter((meme) => meme.url.includes("png"));
    } else if (fileFormatOpt === "jpeg") {
      filteredList = memes.filter((meme) => meme.url.includes("jpeg"));
    }
    if (filteredList.length === 0) {
      props.handleOpenSnack();
      console.log("no memes");
      return;
    }
    props.setMemes(filteredList);
    if (props.setCurrentMemeIndex ? props.setCurrentMemeIndex(0) : null);
  };

  /*
    The method filterMemesByVote takes the selected vote operand and the given number of the filter modal.
    It checks if the selected number is there and filters the memes by that operand and number.
    It updates Memes by the filltered list and sets the index to the first image.
    When no meme fulfills the filter criteria the snackbar with a warning is opened and the memes is not updated.
    */
  const filterMemesByVote = () => {
    let filteredList = [];

    if (!voteNumber) {
      console.log("No number to filter by.");
      return;
    }
    if (voteEquals === "equals") {
      filteredList = memes.filter(
        (meme) => meme.listlikes.length - meme.dislikes.length === voteNumber
      );
    } else if (voteEquals === "greater") {
      filteredList = memes.filter(
        (meme) => meme.listlikes.length - meme.dislikes.length > voteNumber
      );
    } else if (voteEquals === "smaller") {
      filteredList = memes.filter(
        (meme) => meme.listlikes.length - meme.dislikes.length < voteNumber
      );
    }
    if (filteredList.length === 0) {
      props.handleOpenSnack();
      console.log("no memes");
      return;
    }
    props.setMemes(filteredList);
    if (props.setCurrentMemeIndex ? props.setCurrentMemeIndex(0) : null);
  };

  /* 
  handels closing of the filter Modal.
  */
  const handleModuleClose = () => {
    props.handleFilterClose();
  };

  return (
    <Modal
      open={props.open}
      onClose={handleModuleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography variant="h5">Filter by</Typography>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={isFilteredByCreationDate}
                onChange={() =>
                  setIsFilteredByCreationDate(!isFilteredByCreationDate)
                }
                name="checkedB"
                color="primary"
              />
            }
            label="Creation Date"
          />
          {isFilteredByCreationDate ? (
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  className={classes.spacing}
                  autoOk
                  clearable
                  variant="inline"
                  inputVariant="outlined"
                  label="from"
                  format="MM/dd/yyyy"
                  value={filterDateFrom}
                  InputAdornmentProps={{ position: "start" }}
                  onChange={(date) => setFilterDateFrom(date)}
                />
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  className={classes.spacing}
                  autoOk
                  clearable
                  variant="inline"
                  inputVariant="outlined"
                  label="till"
                  format="MM/dd/yyyy"
                  value={filterDateTill}
                  InputAdornmentProps={{ position: "start" }}
                  onChange={(date) => setFilterDateTill(date)}
                />
              </MuiPickersUtilsProvider>
            </div>
          ) : null}
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={isFilteredByVote}
                onChange={() => setIsFilteredByVote(!isFilteredByVote)}
                name="checkedB"
                color="primary"
              />
            }
            label="Votes"
          />
          {isFilteredByVote ? (
            <div>
              <FormControl
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel htmlFor="outlined-age-native-simple">
                  Votes
                      </InputLabel>
                <Select
                  native
                  label="Votes"
                  id="select-Vote-Option"
                  value={voteEquals}
                  onChange={handleFilterVoteChange}
                >
                  <option value={"equals"}>equals</option>
                  <option value={"greater"}>greater</option>
                  <option value={"smaller"}>smaller</option>
                </Select>
              </FormControl>

              <TextField
                id="standard-basic"
                type="number"
                variant="outlined"
                label="Number"
                className={classes.numberField}
                value={voteNumber}
                onChange={(event) => setVoteNumber(event.target.value)}
              />
            </div>
          ) : null}
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={isFilteredByFileFormat}
                onChange={() =>
                  setIsFilteredByFileFormat(!isFilteredByFileFormat)
                }
                name="checkedB"
                color="primary"
              />
            }
            label="File Format"
          />
          {isFilteredByFileFormat ? (
            <div>
              <FormControl
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel htmlFor="outlined-format-native-simple">
                  FileFormat
                      </InputLabel>
                <Select
                  native
                  label="FileFormat"
                  id="select-FileFormat-Option"
                  value={fileFormatOpt}
                  onChange={handleFilterFileFormatChange}
                >
                  <option value={"png"}>png</option>
                  <option value={"jpg"}>jpg</option>
                  <option value={"jpeg"}>jpeg</option>
                </Select>
              </FormControl>
            </div>
          ) : null}
        </div>
        <Button
          className="classes.buttonStyle selection"
          variant="contained"
          color="secondary"
          disabled={!filterMemes}
          onClick={filterMemes}
        >
          Apply
              </Button>
      </div>
    </Modal>

  );
}

export default Filter;
