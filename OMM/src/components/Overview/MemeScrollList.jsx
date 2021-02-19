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

} from "@material-ui/core";

import {
    Sort,
    FilterList,
    ExpandLess,
    ExpandMore,
} from '@material-ui/icons';

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";

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
    
}));



function MemeScrollList() {

    const [memes, setMemes] = useState([{caption: Array(0), tags: Array(0), _id: "5fdf7a7a65f604350c20b629", upper: "Uploading the group task before deadline", lower: "Uni2work NOT working"}]);
    const [searchTerm, setSearchTerm] = useState(null);
    const [sortOpt, setSortOpt] = useState(null);
    const [sortDown, setSortDown] = useState(true);

    const classes = useStyles();

    const handleChange = () => (event) => {
        setSearchTerm(event.target.value);
        filterMemesBy();
    };

   const handleSortOptChange = (event) => {
       setSortOpt(event.target.value);
        if (event.target.value === "votes"){
            sortMemesByVote();
        } else if (event.target.value === "creationDate"){
            sortMemesByDate();
        } else {
            loadMemes();
        }
   }

   const handleClickSortDirection = () => { 
        setSortDown(!sortDown);
        if(sortOpt === "votes"){
            sortMemesByVote();
        } else if (sortOpt === "creationDate"){
            sortMemesByDate();
        }
   }

   const sortMemesByVote = () => {
            const sortedMemeList = memes;
            if(!sortDown){
                memes.sort((memeA, memeB) => (memeA.likes - memeB.likes));
            } else {
                memes.sort((memeA, memeB) => (memeB.likes - memeA.likes));
            }
            console.log(sortedMemeList);
            //setMemes(sortedMemeList);
    }

    const sortMemesByDate = () => {
    return (
        <div>
            {memes.filter(list => memes.map(filteredName => (
                <li>
                    {filteredName}
                </li>
            )))}
        </div>
    )
    }

    const filterMemesByDate = () => {
        return (
            <div>
                {memes.filter(list => memes.includes('J')).map(filteredName => (
                    <li>
                        {filteredName}
                    </li>
                ))}
            </div>
        )
    }



    const filterMemesBy = async() => {
            await fetch("http://localhost:3030/memeIO/get-memes-by/" + searchTerm, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    searchTerm: setSearchTerm,
                }),
            }).then(res => {
                
            res.json().then(json => {
                    setMemes(json.docs);
                    console.log(json.docs)
                    return json;
                })
            })
        ;
    }

  
    const ListMemes = ({ listmemes }) => {
        return (
            <Grid container spacing={1}>
                {
                    listmemes.map((meme) => (
                                              <MemeView memeInfo={meme} key={meme._id} />
                    ))}
            </Grid>
        )
    };
    const loadMemes = async () => {
        await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
            res.json().then(json => {
                setMemes(json.docs);
                console.log(json.docs)
                return json;
            })
        })
    };

    // useEffect for componentDidMount
    // see: https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
       
        loadMemes();
    }, []);


    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs></Grid>
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
                <FormControl className={classes.formControl}>
                    <InputLabel id="label-Sort-Option">Sort by</InputLabel>
                      <Select
                      labelId="label-Sort-Option"
                      id="select-Sort-Option"
                      value={sortOpt}
                      onChange={handleSortOptChange}
                       >
                          <option aria-label="None" value="">None</option>
                         <option value={"votes"}>Votes</option>
                         <option value={"creationDate"}>Creation Date</option>
                      
                     </Select>
                 </FormControl>
                    <IconButton
                    aria-label="toggle sortDown"
                    onClick={handleClickSortDirection}
                    edge="end"
                    >
                        {sortDown? <ExpandMore />: <ExpandLess />}
                    </IconButton>
                    <IconButton>
                        < FilterList />
                    </IconButton>
                    </Grid>
               
            </Grid>
            <Grid container spacing={1}>
                <ListMemes className={classes.spacing} listmemes={memes} />
            </Grid>
        </Container>
    );
}


export default MemeScrollList;