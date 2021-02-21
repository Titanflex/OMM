import React, { useState, useEffect, } from "react";
import {
    Grid,
    TextField,
    Container,
    makeStyles,
    IconButton,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    Popover,
    Typography,
    Button,
    Modal,
    FormControlLabel,
    Checkbox,
    Snackbar,

} from "@material-ui/core";

import {
    Alert,
} from '@material-ui/lab';

import Moment from 'moment';

import {
    Tune,
    ArrowDownward,
    ArrowUpward,
} from '@material-ui/icons';


import "./../../css/Overview/scrolllist.css";

import {
    DatePicker,
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";

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
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    paper: {
        position: 'absolute',
        width: `${50}%`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

}));



function MemeScrollList() {

    const [memes, setMemes] = useState([{ caption: Array(0), tags: Array(0), _id: "5fdf7a7a65f604350c20b629", upper: "Uploading the group task before deadline", lower: "Uni2work NOT working" }]);
    const [originalMemes, setOriginalMemes] = useState([{ caption: Array(0), tags: Array(0), _id: "5fdf7a7a65f604350c20b629", upper: "Uploading the group task before deadline", lower: "Uni2work NOT working" }]);


    const [searchTerm, setSearchTerm] = useState(null);
    const [sortOpt, setSortOpt] = useState(null);
    const [sortDown, setSortDown] = useState(false);

    const [isFilteredByVote, setIsFilteredByVote] = useState(false);
    const [voteNumber, setVoteNumber] = useState(null);
    const [voteEquals, setVoteEquals] = useState("equals");

    const [isFilteredByCreationDate, setIsFilteredByCreationDate] = useState(false);
    const [filterDateFrom, setFilterDateFrom] = useState(new Date());
    const [filterDateTill, setFilterDateTill] = useState(new Date());

    const [isFilteredByFileFormat, setIsFilteredByFileFormat] = useState(false);
    const [fileFormatOpt, setfileFormatOpt] = useState("png");


    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);



    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();




    //Modal
    const handleOpen = () => {
        setOpen(true);
        setMemes(originalMemes);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //SnackBar
    const handleOpenSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };





    /*Sort*/
    const handleSortOptChange = (event) => {
        setSortOpt(event.target.value);
        if (event.target.value === "votes") {
            sortMemesByVote();
        } else if (event.target.value === "creationDate") {
            sortMemesByDate();
        }
    }

    const handleClickSortDirection = () => {
        setSortDown(!sortDown);
        if (sortOpt === "votes") {
            sortMemesByVote();
        } else if (sortOpt === "creationDate") {
            sortMemesByDate();
        }
    }

    const sortMemesByVote = () => {
        const sortedMemeList = memes;
        if (!sortDown) {
            memes.sort((memeA, memeB) => (memeA.likes - memeB.likes));
        } else {
            memes.sort((memeA, memeB) => (memeB.likes - memeA.likes));
        }
    }

    const sortMemesByDate = () => {
        if (!sortDown) {
            memes.sort((memeA, memeB) => (Moment(memeA.creationDate) - Moment(memeB.creationDate)));
        } else {
            memes.sort((memeA, memeB) => (Moment(memeB.creationDate) - Moment(memeA.creationDate)));
        }
    }



    /*Filter*/
    const handleFilterVoteChange = (event) => {
        setVoteEquals(event.target.value);
    }

    const handleFilterFileFormatChange = (event) => {
        setfileFormatOpt(event.target.value);
    }

    const filterMemes = () => {
        setOpen(false);
        if (isFilteredByVote) {
            filterMemesByVote();
        }
        if (isFilteredByCreationDate) {
            filterMemesByDate();
        }
        if (isFilteredByFileFormat) {
            filterMemesByFileFormat();
        }
    }


    const filterMemesByDate = () => {

        let filteredList = [];

        if (filterDateFrom && filterDateTill) {
            filteredList = memes.filter(meme => Moment(meme.creationDate) >= Moment(filterDateFrom));
            filteredList = filteredList.filter(meme => Moment(meme.creationDate) <= Moment(filterDateTill));

            setMemes(filteredList);
            return;
        }
        if (filterDateFrom) {
            filteredList = memes.filter(meme => Moment(meme.creationDate) >= Moment(filterDateFrom));
            setMemes(filteredList);
        }
        if (filterDateTill) {
            filteredList = memes.filter(meme => Moment(meme.creationDate) <= Moment(filterDateTill));
            setMemes(filteredList);
        }

        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
        }
    }

    const filterMemesByFileFormat = () => {
        let filteredList = [];

        console.log(fileFormatOpt);

        if (fileFormatOpt === "jpg") {
            filteredList = memes.filter(meme => meme.url.includes("jpg"));

        } else if (fileFormatOpt === "png") {
            filteredList = memes.filter(meme => meme.url.includes("png"));
        }
        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
        }
        setMemes(filteredList);

    }

    const filterMemesByVote = () => {
        let filteredList = [];

        if (!voteNumber) {
            console.log("No number to filter by.");
            return;
        }
        if (voteEquals === "equals") {
            filteredList = memes.filter(meme => meme.likes == voteNumber);
        } else if (voteEquals === "greater") {
            filteredList = memes.filter(meme => meme.likes > voteNumber);
        } else if (voteEquals === "smaller") {
            filteredList = memes.filter(meme => meme.likes < voteNumber);
        }
        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
        }
        setMemes(filteredList);
    }


    /* TODO Search*/
    const handleChange = () => (event) => {
        let filteredList = originalMemes;

        if (event.target.value != "") {
            filteredList = originalMemes.filter(meme => {
                return meme.title.toLowerCase().includes(event.target.value.toLowerCase());
            })
        }
        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
        }
        setMemes(filteredList);
    };


    const ListMemes = ({ listmemes }) => {
        return (
            <Grid container spacing={1}>
                {
                    listmemes.map((meme) => (
                        <MemeView memeInfo={meme} loadMemesFunction={loadMemes} key={meme._id} />
                    ))}
            </Grid>
        )
    };
    const loadMemes = async () => {
        await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
            res.json().then(json => {
                setMemes(json.docs);
                setOriginalMemes(json.docs);
                console.log(json.docs)
                return json;
            })
        })
    };

    useEffect(() => {
        loadMemes();
    }, []);


    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs>
                    <IconButton
                        onClick={handleOpen}
                        variant="contained"
                        edge="end"
                    >
                        < Tune />
                    </IconButton>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description">
                        <div style={modalStyle} className={classes.paper}>


                            <Typography variant="h5">
                                Filter by
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isFilteredByCreationDate}
                                        onChange={() => setIsFilteredByCreationDate(!isFilteredByCreationDate)}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="Creation Date"
                            />
                            {isFilteredByCreationDate ?
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
                                            onChange={date => setFilterDateFrom(date)}
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
                                            onChange={date => setFilterDateTill(date)}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                : null}

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
                            {isFilteredByVote ?
                                <div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="label-Vote-Option">Select</InputLabel>
                                        <Select
                                            native
                                            labelId="label-Vote-Option"
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
                                        label="Standard"

                                        value={voteNumber}
                                        onChange={(event) => setVoteNumber(event.target.value)}
                                    />

                                </div>
                                : null}

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isFilteredByFileFormat}
                                        onChange={() => setIsFilteredByFileFormat(!isFilteredByFileFormat)}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="File Format"
                            />
                            {isFilteredByFileFormat ?
                                <div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="label-Sort-Option">Sort by</InputLabel>
                                        <Select
                                            native
                                            labelId="label-FileFormat-Option"
                                            id="select-FileFormat-Option"
                                            value={fileFormatOpt}
                                            onChange={handleFilterFileFormatChange}
                                            inputProps={{
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >
                                            <option value={"png"}>png</option>
                                            <option value={"jpg"}>jpg</option>

                                        </Select>
                                    </FormControl>
                                </div>
                                : null}


                            <Button
                                className="classes.buttonStyle selection"
                                variant="contained"
                                color="secondary"
                                disabled={!memes}
                                onClick={filterMemes}
                            >
                                Apply
                            </Button>


                        </div>
                    </Modal>

                    <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                                <Alert onClose={handleCloseSnack} severity="error">
                                    No memes
  </Alert>
                            </Snackbar>

                </Grid>
                <Grid item xs={4}>
                    <div className="search-container">
                        <form>
                            <TextField
                                className="SearchTextField"
                                id="search"
                                label="Search Meme"
                                placeholder="Search Meme"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                onChange={handleChange()}
                            />
                        </form>
                    </div>
                </Grid>
                <Grid item xs>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="label-Sort-Option">Sort by</InputLabel>
                        <Select
                            native
                            labelId="label-Sort-Option"
                            //label="Sort by"
                            id="select-Sort-Option"
                            value={sortOpt}
                            onChange={handleSortOptChange}
                        >
                            <option value={"none"}>None</option>
                            <option value={"votes"}>Votes</option>
                            <option value={"creationDate"}>Creation Date</option>

                        </Select>
                    </FormControl>
                    <IconButton
                        aria-label="toggle sortDown"
                        onClick={handleClickSortDirection}
                        edge="end"
                    >
                        {sortDown ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>

                </Grid>

            </Grid>
            <Grid container spacing={1}>
                <ListMemes className={classes.spacing} listmemes={memes} />
            </Grid>
        </Container >
    );
}


export default MemeScrollList;