import React, { useState, useEffect, useRef } from "react";
import {
    Grid,
    Button,
    Container,
    IconButton,
    Typography,
    TextField,
    Box,
    makeStyles,
    Select,
    FormControl,
    InputLabel,
    Modal,
    FormControlLabel,
    Checkbox,
    Snackbar,
} from "@material-ui/core";

import {
    ToggleButton,
    Alert,
} from '@material-ui/lab';

import {
    Hearing,
    PlayArrow,
    Pause,
    Shuffle,
    Close,
    Tune,
    ArrowDownward,
    ArrowUpward,
    ChevronLeft,
    ChevronRight,
} from "@material-ui/icons";

import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { Chart } from "react-google-charts";

import DateFnsUtils from '@date-io/date-fns';


import Moment from 'moment';


import MemeView from "./MemeView";
import Searchbar from "./Searchbar";


import "./../../css/Overview/singleView.css";
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



function useInterval(callback, delay) {

    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        let id = setInterval(() => {
            savedCallback.current();
        }, delay);
        return () => clearInterval(id);
    }, [delay]);
}



const SingleView = () => {

    const [memes, setMemes] = useState([{ caption: Array(0), tags: Array(0), _id: "5fdf7a7a65f604350c20b629", upper: "Uploading the group task before deadline", lower: "Uni2work NOT working" }]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [comment, setComment] = useState("");

    const [originalMemes, setOriginalMemes] = useState([{ caption: Array(0), tags: Array(0), _id: "5fdf7a7a65f604350c20b629", upper: "Uploading the group task before deadline", lower: "Uni2work NOT working" }]);

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


    //randomize index
    const [isAccessible, setIsAccessible] = useState(false);





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
        if (!sortDown) {
            memes.sort((memeA, memeB) => ((memeA.listlikes.length - memeA.dislikes.length) - (memeB.listlikes.length - memeB.dislikes.length)));
        } else {
            memes.sort((memeA, memeB) => ((memeB.listlikes.length - memeB.dislikes.length) - (memeA.listlikes.length - memeA.dislikes.length)));
        }
        setCurrentMemeIndex(0);
    }

    const sortMemesByDate = () => {
        if (!sortDown) {
            memes.sort((memeA, memeB) => (Moment(memeA.creationDate) - Moment(memeB.creationDate)));
        } else {
            memes.sort((memeA, memeB) => (Moment(memeB.creationDate) - Moment(memeA.creationDate)));
        }
        setCurrentMemeIndex(0);
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
        } else if (filterDateFrom) {
            filteredList = memes.filter(meme => Moment(meme.creationDate) >= Moment(filterDateFrom));
        } else if (filterDateTill) {
            filteredList = memes.filter(meme => Moment(meme.creationDate) <= Moment(filterDateTill));
        }
        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
            return;
        }
        setMemes(filteredList);
        setCurrentMemeIndex(0);
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
            return;
        }
        setMemes(filteredList);
        setCurrentMemeIndex(0);

    }

    const filterMemesByVote = () => {
        let filteredList = [];

        if (!voteNumber) {
            console.log("No number to filter by.");
            return;
        }
        if (voteEquals === "equals") {
            filteredList = memes.filter(meme => (meme.listlikes.length - meme.dislikes.length) == voteNumber);
        } else if (voteEquals === "greater") {
            filteredList = memes.filter(meme => (meme.listlikes.length - meme.dislikes.length) > voteNumber);
        } else if (voteEquals === "smaller") {
            filteredList = memes.filter(meme => (meme.listlikes.length - meme.dislikes.length) < voteNumber);
        }
        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
            return;
        }
        setMemes(filteredList);
        setCurrentMemeIndex(0);
    }


    /* Search*/
    const handleChange = () => (event) => {
        let filteredList = originalMemes;

        if (event.target.value !== "") {
            filteredList = originalMemes.filter(meme => {
                return meme.title.toLowerCase().includes(event.target.value.toLowerCase());
            })
        }
        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
            return;
        }
        setMemes(filteredList);
        setCurrentMemeIndex(0);
    };



    function randomize() {
        let randomIndex = Math.floor(Math.random() * memes.length);
        if (randomIndex !== currentMemeIndex) {
            setCurrentMemeIndex(randomIndex);
        } else {
            randomize();
        }
    }

    async function nextMeme() {
        let current = currentMemeIndex;
        console.log(currentMemeIndex);
        if (memes.length > 1) {
            if (isRandom) {
                randomize();
            } else {
                current = currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
                setCurrentMemeIndex(current);
            }

        }
    }

    //previous meme by decreasing index
    function previousMeme() {
        let current = currentMemeIndex;
        if (memes.length > 1) {
            current =
                currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
            setCurrentMemeIndex(current);
        }
    }

    //Meme Component
    const SingleMeme = () => {
        return (
            <MemeView memeInfo={memes[currentMemeIndex]} isAccessible={isAccessible} getUpdatedMemes={getUpdatedMemes} />
        )
    };



    const handleCommentClick = () => {
        if (comment !== "") {
            addComment();
            getUpdatedMemes();
        }
    }


    async function addComment() {
        setComment("");
        const currentMemeId = memes[currentMemeIndex]._id;
        await fetch("http://localhost:3030/memeIO/add-comment", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: currentMemeId,
                user: localStorage.user,
                date: Date.now(),
                commenttext: comment,
            }),
        }).then((response) => {
            console.log(response);

        });;
    }

    const handleDeleteCommentClick = (comment) => {
        console.log("delete comment");
        removeComment(comment);
        getUpdatedMemes();
    }

    async function removeComment(comment) {
        const currentMemeId = memes[currentMemeIndex]._id;
        await fetch("http://localhost:3030/memeIO/remove-comment", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: currentMemeId,
                user: comment.user,
                commenttext: comment.commenttext,
            }),
        }).then((response) => {
            console.log(response);
        });
    }

    const loadMemes = async () => {
        await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
            res.json().then(json => {
                setMemes(json.docs);
                setOriginalMemes(json.docs);


                const url = window.location.pathname;
                const memeId = url.substring(url.lastIndexOf('/') + 1);
                const curMeme = json.docs.find(element => element._id === memeId);

                const ind = json.docs.indexOf(curMeme);


                setCurrentMemeIndex(ind);
                return json;
            });
        })
    };

    useEffect(() => {
        loadMemes();
    }, []);

    const getUpdatedMemes = async () => {
        console.log("update Parent");
        await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
            res.json().then(json => {
                setMemes(json.docs);
                return json;
                ;
            });
        })
    }


    //Interval setting for autoplay
    useInterval(() => {
        if (isPlaying) {
            let current = currentMemeIndex;
            console.log(currentMemeIndex);
            if (memes.length > 1) {
                if (isRandom) {
                    randomize();
                } else {
                    current = currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
                    setCurrentMemeIndex(current);
                }
            }
        }
    }, 5000);



    //Comments
    const ListComments = ({ currentMeme }) => {
        return (
            <Grid container spacing={1}>
                {
                    (currentMeme.hasOwnProperty("comments") ?
                        currentMeme.comments.map((comment) => (

                            <div key={comment._id} style={{ width: '100%' }}>
                                <Box
                                    className="classes.spacing"
                                    bgcolor="background.theme.palette.paper"
                                    p={{ xs: 2, sm: 3, md: 4 }}
                                >
                                    <Typography variant="body1">
                                        Author: {comment.hasOwnProperty('user') ? comment.user : "Anonymous"}
                                    </Typography>
                                    <Typography variant="body2">
                                        Created: {comment.hasOwnProperty('date') ? Moment(comment.date).format('MMM Do YY') : "No date"}
                                    </Typography>
                                    <Typography variant="body2">
                                        {comment.hasOwnProperty('commenttext') ? comment.commenttext : "No text"}
                                    </Typography>
                                    {(comment.user == localStorage.user) ? <IconButton
                                        onClick={() => handleDeleteCommentClick(comment)}
                                        variant="contained"
                                        edge="end"
                                    >
                                        < Close />
                                    </IconButton> : null}
                                </Box>
                            </div>
                        )) : null)

                }

            </Grid>
        )
    };



    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs>
                    <ToggleButton

                        className={classes.spacing}
                        value="check"
                        selected={isPlaying}
                        onChange={() => {
                            setIsPlaying(!isPlaying);
                        }}
                    > {isPlaying ? <Pause /> : <PlayArrow />}{isPlaying ? "Pause" : "Play"}
                    </ToggleButton>

                    <ToggleButton
                        className={classes.spacing}
                        value="check"
                        selected={isRandom}
                        onChange={() => {
                            setIsRandom(!isRandom);
                        }}
                    ><Shuffle />                   Random                </ToggleButton>
                    <ToggleButton
                        className={classes.spacing}
                        value="check"
                        selected={isAccessible}
                        onClick={() => setIsAccessible(!isAccessible)}
                    > <Hearing />
                    </ToggleButton>
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
                    </div></Grid>
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

            <Grid container spacing={3}>
                <Grid item xs={1} >
                    <IconButton className="arrows" onClick={previousMeme} aria-label="previous">
                        <ChevronLeft fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid item xs={8}>
                    <SingleMeme listmemes={memes} />

                </Grid>
                <Grid item xs={1}>
                    <IconButton className="arrows" onClick={nextMeme} aria-label="next">
                        <ChevronRight fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={1} ></Grid>
                <Grid container item xs={8}>

                    <Grid item xs>
                        <ListComments className={classes.spacing} currentMeme={memes[currentMemeIndex]} />
                    </Grid>

                    <Grid item xs>
                        <TextField
                            id="outlined-multiline-static"
                            label="Add comment"
                            multiline
                            rows={4}
                            variant="outlined"
                            onChange={(event) => setComment(event.target.value)}
                            value={comment}
                        />

                        <Button
                            className="classes.buttonStyle selection"
                            //startIcon={<CloudDownload />}
                            variant="contained"
                            color="secondary"
                            disabled={!memes[currentMemeIndex]}
                            onClick={handleCommentClick}
                        >
                            Publish
                        </Button>

                    </Grid>
                </Grid>
                <Grid item xs={1} ></Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={1} ></Grid>
                <Grid container item xs={8}>
                    <Chart
                        width={'500px'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Likes and Dislikes', 'Number'],
                            ['Likes', memes[currentMemeIndex].hasOwnProperty("listlikes")? memes[currentMemeIndex].listlikes.length : 0],
                            ['Dislikes', memes[currentMemeIndex].hasOwnProperty("dislikes")? memes[currentMemeIndex].dislikes.length : 0],
                        ]}
                        options={{
                            title: 'Distribution of likes',
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                </Grid>
                <Grid item xs={1} ></Grid>
            </Grid>

        </Container >
    );
}


export default SingleView;