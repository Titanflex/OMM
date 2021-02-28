import React, { useState } from "react";



//chart library to visualize data
import { Chart } from "react-google-charts";

import {
  Grid,
  Typography,
  makeStyles,
  Modal,
} from "@material-ui/core";





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

}));

/**
 * Shows charts for specific meme
 * @param {Meme[]} props A list of the memes.
 */
const InfoModal = props => {
  const memes = props.memes;
  const currentMemeIndex = props.currentMemeIndex;
  const chartData = props.chartData;
  const dataLoading = props.dataLoading;
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);



  const handleModuleClose = () => {
    props.onInfosClose();
  };



  return (
    <Modal
      open={props.open}
      onClose={handleModuleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography variant="h5">Graph</Typography>
        <Grid>
          <Chart
            width={"500px"}
            height={"300px"}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={[
              ["Likes and Dislikes", "Number"],
              [
                "Likes",
                memes[currentMemeIndex].hasOwnProperty("listlikes")
                  ? memes[currentMemeIndex].listlikes.length
                  : 0,
              ],
              [
                "Dislikes",
                memes[currentMemeIndex].hasOwnProperty("dislikes")
                  ? memes[currentMemeIndex].dislikes.length
                  : 0,
              ],
            ]}
            options={{
              title: "Distribution of likes",
            }}
            rootProps={{ "data-testid": "1" }}
          />

          {dataLoading ? (
            <Chart
              chartType="LineChart"
              data={chartData}
              options={{
                hAxis: {
                  format: 'd MMM',
                },
                vAxis: {
                  format: 'short',
                },
                title: 'Likes and dislikes over time.',
              }}
              rootProps={{ 'data-testid': '3' }}
            />
          ) : (
              <div>Fetching data from API</div>
            )}

        </Grid>
      </div>
    </Modal>



  );
}

export default InfoModal;
