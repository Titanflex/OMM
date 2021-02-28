import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import {ShowChart} from "@material-ui/icons";
import {Grid, Typography} from "@material-ui/core";
import {Chart} from "react-google-charts";


//align modal in center of screen
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
    paper: {
        position: 'absolute',
        width: 564,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


/**
 * component generates statistics chart for templates
 * @param params, set in MemeGenerator
 * @returns {JSX.Element}
 * @constructor
 */
const StatisticsChart= params => {
    const[open, setOpen] = useState(false);
    let likeDf = [];
    const [chartData, setChartData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    let usedDf = [];
    const [chartUsedData, setChartUsedData] = useState(null);
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();

    //close and open modal
    const handleOpen = () => {
        setOpen(true);
        showStatistics();
    };
    const handleClose = () => {
        setOpen(false);
    };

    /**
     * @returns array with dates of the last two months
     */
    const getDaysOfMonth = () => {
        const today = new Date(Date.now());
        let dateThreeMonths = new Date(today);
        dateThreeMonths.setMonth(dateThreeMonths.getMonth() - 2);
        let dateArray = [];
        let currentDate = dateThreeMonths;
        while (currentDate <= today) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    /**
     * sets likes/usages of the template in the last two months
     */
    const showStatistics = () => {
        const datesArray = getDaysOfMonth();
        //likes
        if (params.template.hasOwnProperty("likes")) {
            let likeList = params.template.likes;
            datesArray.forEach(date => {
                const dateDate = new Date(date);
                let likeCount = 0;

                likeList.forEach(like => {
                    const likeDate = new Date(like.date);
                    likeCount = (likeDate.setHours(0, 0, 0, 0) === dateDate.setHours(0, 0, 0, 0)) ? likeCount + 1 : likeCount;
                })

                likeDf.push({ "date": dateDate, "likeCount": likeCount });
            })
        }

        const columns = [
            { type: 'date', label: 'date' },
            { type: 'number', label: 'likeCount' },
        ]
        let rows = []
        const nonNullData = likeDf.filter(row => row.likeCount !== null)
        for (let row of nonNullData) {
            const { date, likeCount } = row
            rows.push([new Date(Date.parse(date)), likeCount])
        }

        setChartData([columns, ...rows]);

        //used
        if (params.template.hasOwnProperty("used")) {
            let usedList = params.template.used;

            datesArray.forEach(date => {
                const dateDate = new Date(date);
                let usedCount = 0;

                usedList.forEach(used => {
                    const usedDate = new Date(used.date);
                    usedCount = (usedDate.setHours(0, 0, 0, 0) === dateDate.setHours(0, 0, 0, 0)) ? usedCount + 1 : usedCount;
                })

                usedDf.push({ "date": dateDate, "usedCount": usedCount });
            })
        }
        const usedColumns = [
            { type: 'date', label: 'date' },
            { type: 'number', label: 'usedCount' },
        ]
        let usedrows = []
        const usednonNullData = usedDf.filter(row => row.usedCount !== null)
        for (let row of usednonNullData) {
            const { date, usedCount } = row
            usedrows.push([new Date(Date.parse(date)), usedCount])
        }
        setDataLoading(true);
        setChartUsedData([usedColumns, ...usedrows]);
        setOpen(true);
    };

    return (
        <div>
            <Button
                className="classes.buttonStyle modal"
                startIcon={<ShowChart/>}
                variant="contained"
                onClick={handleOpen}
                color="secondary"
            >
                More template infos
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>

                    <div style={{maxHeight: window.innerHeight - 100, overflow: "auto"}}>
                        <Typography variant="h5">Graph</Typography>
                        <Grid>
                            {dataLoading ? (
                                <div>

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
                                            title: 'Likes over time.',
                                        }}
                                        rootProps={{ 'data-testid': '2' }}
                                    />
                                    <Chart
                                        chartType="LineChart"
                                        data={chartUsedData}
                                        options={{
                                            hAxis: {
                                                format: 'd MMM',
                                            },
                                            vAxis: {
                                                format: 'short',
                                            },
                                            title: 'Used over time.',
                                        }}
                                        rootProps={{ 'data-testid': '2' }}
                                    />
                                </div>
                            ) : (
                                <div>Fetching data from API</div>
                            )}
                        </Grid>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default StatisticsChart;
