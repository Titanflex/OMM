import React, { useRef, useState, useEffect, useCallback } from "react";
import {
    Grid, GridList, GridListTile, GridListTileBar, Button,
    Container,
    FormControl,
    MenuItem,
    Select,
    makeStyles,
    IconButton,
    TextField,
} from "@material-ui/core";

import FormatColorTextIcon from '@material-ui/icons/FormatColorText';


import {
    FormatBold,
    FormatItalic,
} from "@material-ui/icons";


import { TwitterPicker } from 'react-color';
import "canvas-record";
import "canvas-context";

import "./../../css/MemeCreator/memeCreator.css";

import 'isomorphic-fetch'
import { Stage, Layer, Image, Text } from "react-konva";
import Konva from "konva";
import "gifler";
import createCanvasRecorder from "canvas-record";


const Video = ({ src }) => {
    const imageRef = React.useRef(null);
    const [size, setSize] = React.useState({ width: 50, height: 50 });

    // we need to use "useMemo" here, so we don't create new video elment on any render
    const videoElement = React.useMemo(() => {
        const element = document.createElement("video");
        element.crossOrigin = "Anonymous";
        element.src = src;
        return element;
    }, [src]);

    // when video is loaded, we should read it size
    React.useEffect(() => {
        const onload = function () {
            setSize({
                width: 500,
                height: 400
            });
        };
        videoElement.addEventListener("loadedmetadata", onload);
        return () => {
            videoElement.removeEventListener("loadedmetadata", onload);
        };
    }, [videoElement]);

    // use Konva.Animation to redraw a layer
    React.useEffect(() => {
        videoElement.play();
        videoElement.loop = true;
        videoElement.muted = true;
        const layer = imageRef.current.getLayer();

        const anim = new Konva.Animation(() => { }, layer);
        anim.start();
        return () => anim.start();
    }, [videoElement]);

    return (
        <Image
            ref={imageRef}
            image={videoElement}
            x={20}
            y={20}
            width={size.width}
            height={size.height}
            draggable
        />
    );
};

const GIF = ({ src }) => {
    const imageRef = React.useRef(null);
    const canvas = React.useMemo(() => {
        const node = document.createElement("canvas");
        return node;
    }, []);



    React.useEffect(() => {
        // save animation instance to stop it on unmount
        let anim;
        window.gifler(src).get(a => {
            anim = a;
            anim.animateInCanvas(canvas);
            anim.onDrawFrame = (ctx, frame) => {
                ctx.drawImage(frame.buffer, frame.x, frame.y);
                imageRef.current.getLayer().draw();
            };
        });
        return () => anim.stop();
    }, [src, canvas]);

    return <Image image={canvas} ref={imageRef} draggable={true} />;
};


function VideoGenerator() {


    const [gifs, setGifs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [textFormat, setTextFormat] = useState("")
    const [color, setColor] = useState("white");
    const [fontSize, setFontSize] = useState(30);

    const [canvasWidth, setCanvasWidth] = useState(350);
    const [canvasHeight, setCanvasHeight] = useState(250);

    const [isFreestyle, setIsFreestyle] = useState(false);
    const [images, setImages] = useState([]);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const fontSizes = [
        10,
        12,
        14,
        16,
        18,
        20,
        22,
        24,
        26,
        28,
        30,
        32,
        34,
        36,
        38,
        40,
        42,
        46,
        48,
        50,
    ];

    const maxWidth = 600;
    const maxHeight = 1000;
    const minWidth = 200;
    const minHeight = 200;

    const useStyles = makeStyles((theme) => ({
        textFormat: {
            fontWeight: bold ? "bold" : "normal",
            fontStyle: italic ? "italic" : "normal",
            "-webkit-text-fill-color": color,
            fontSize: fontSize,
        },
        heading: {
            textAlign: 'left',
            margin: "16px",
        },
        upperText: {
            position: 'absolute',
            left: "0px",
            top: "0px",
            width: '100%',
            height: '100%',
            'max-width': maxWidth + 'px',
            'max-height': maxHeight + 'px',
            overflow: 'hidden',
            display: "none",
        }, memeCanvas: {
            width: (isFreestyle) ? canvasWidth + "px" : '350px',
            'min-width': minWidth + 'px',
            'min-height': minHeight + 'px',
            'max-width': maxWidth + 'px',
            'max-height': maxHeight + 'px',
            height: (isFreestyle) ? (canvasHeight + "px") : 'auto',
        }, freestyleCanvas: {
            width: canvasWidth + "px",
            height: canvasHeight + "px",
            backgroundColor: "white",
            border: '1px solid grey',
        },
        memeImg: {
            width: '350px',
            height: 'auto',
            display: 'block',
        }, canvas: {
            width: (isFreestyle) ? canvasWidth + "px" : '350px',
            'min-width': minWidth + 'px',
            'min-height': minHeight + 'px',
            'max-width': maxWidth + 'px',
            'max-height': maxHeight + 'px',
            overflow: 'hidden',
        }
    }));

    const classes = useStyles();

    function toggleBold() {
        if (canvasRecorder === null) {
            if (!bold && italic) {
                setBold(true)
                setTextFormat("Bold Italic")
            } else if (!bold && !italic) {
                setBold(true)
                setTextFormat("Bold")
            } else if (bold && italic) {
                setBold(false)
                setTextFormat("Italic")
            } else {
                setBold(false)
                setTextFormat("")
            }
        } else
            alert("This option is not available during recordings")
    }

    function toggleItalic() {
        if (canvasRecorder === null) {
            if (bold && !italic) {
                setItalic(true)
                setTextFormat("Bold Italic")
            } else if (bold && italic) {
                setItalic(false)
                setTextFormat("Bold")
            } else if (!bold && !italic) {
                setItalic(true)
                setTextFormat("Italic")
            } else {
                setItalic(false)
                setTextFormat("")
            }
        } else
            alert("This option is not available during recordings")
    }

    const changeFontSize = (event) => {
        if (canvasRecorder === null)
            setFontSize(event.target.value);
        else
            alert("This option is not available during recordings")
    };

    const handleColorChange = (color) => {
        if (canvasRecorder === null)
            setColor(color.hex);
        else
            alert("This option is not available during recordings")
    }

    const popover = {
        position: 'absolute',
        zIndex: '2',
    }
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }

    const [canvasRef, setCanvasRef] = useState(null);
    const [memeCaption1, setMemeCaption1] = useState("Write first here");
    const [memeCaption2, setMemeCaption2] = useState("Write second here");
    const [memeCaption3, setMemeCaption3] = useState("Write third here");
    let canvasRecorder = null;


    const startRecording = useCallback(() => {
        if (canvasRef !== null) {
            let canvas = canvasRef.getCanvas()._canvas;
            canvasRecorder = createCanvasRecorder(canvas);
            canvasRecorder.start();
        }
    })

    const stopRecording = useCallback(() => {
        if (canvasRecorder !== null) {
            let blob = canvasRecorder.stop();
            console.log(blob)
            canvasRecorder = null;
        }
        /*
        let datafile = new File([file], "record.webm")
        console.log(datafile)
        const recUrl = window.URL.createObjectURL(
            datafile,
        );
        console.log(recUrl)
        const link = document.createElement('a');
        link.href = recUrl;
        link.setAttribute(
            'download',
            `FileName.webm`,
        );
        document.body.appendChild(link);
    
        // Start download
        link.click();
    
        // Clean up and remove the link
        link.parentNode.removeChild(link);
        */
    })

    const onRefChange = useCallback(node => {
        // ref value changed to node
        setCanvasRef(node); // e.g. change ref state to trigger re-render
        if (node === null) {
            // node is null, if DOM node of ref had been unmounted before
            console.log("ref is null")
        } else {
            // ref value exists
            console.log("ref exists")
        }
    }, []);

    const addText = (nbr) => {
        let textCaption = null
        if (nbr === 1) {
            textCaption = memeCaption1
        } else if (nbr === 2) {
            textCaption = memeCaption2
        } else {
            textCaption = memeCaption3
        }

        let text = new Konva.Text({ text: textCaption, fontSize: fontSize, fontFamily: "impact", fill: color, draggable: true, fontStyle: textFormat, id: nbr })
        let tempChildren = canvasRef.getChildren(function (node) {
            return node.getClassName() === "Text"
        })
        let doInsert = true;
        tempChildren.forEach(element => {
            if (element.getAttr("id") === nbr) {
                doInsert = false;
            }
        });
        if (doInsert)
            canvasRef.add(text)
    }

    const removeText = (nbr) => {
        console.log(canvasRef.getChildren(function (node) {
            if (node.getAttr("id") === nbr)
                node.remove()
        }))
        console.log(canvasRef)
    }

    const gifTemplates = [{ url: "http://localhost:3030/images/templates/Maus.gif", name: "Maus" }]

    const showGifTemplates = () => (
        <GridList cellHeight={180} className={classes.gridList} cols={3} style={{ height: 450 }}>
            {gifTemplates.map((template) => (
                <GridListTile key={template.id} style={{ 'cursor': 'pointer' }} cols={template.cols || 1}
                    onClick={() => {

                        setGifs(gifs.concat([template.url]))
                    }}
                >
                    <img src={template.url} alt={(template.name) ? template.name : template.templateName} />
                    <GridListTileBar
                        title={(template.name) ? template.name : template.templateName}
                        titlePosition="top"
                    />
                </GridListTile>
            ))
            }
        </GridList >
    );

    const videoTemplates = [{ url: "http://localhost:3030/images/templates/think.Mp4", name: "Ain't allowed to think" }]

    const showVideoTemplates = () => (
        <GridList cellHeight={180} className={classes.gridList} cols={3} style={{ height: 240, width: 320 }}>
            {videoTemplates.map((template) => (
                <GridListTile key={template.id} style={{ 'cursor': 'pointer' }} cols={template.cols || 1}
                    onClick={() => {

                        setVideos(videos.concat([template.url]))
                    }}
                >
                    <video width="320" height="240" loop muted autoPlay> <source src={template.url} alt={(template.name) ? template.name : template.templateName} /> </video>
                    <GridListTileBar
                        title={(template.name) ? template.name : template.templateName}
                        titlePosition="top"
                    />
                </GridListTile>
            ))
            }
        </GridList >
    );

    return (
        <Container className="memeCreatorContainer" >
            <Grid container alignItems="center" spacing={3}>
                <Grid item s={8} style={{ overflow: "hidden" }}>
                    <IconButton
                        className={"textFormatButton"}
                        onClick={toggleBold}
                        style={bold ? { background: "grey" } : { background: "white" }}
                    >
                        <FormatBold />
                    </IconButton>
                    <IconButton
                        className={"textFormatButton"}
                        onClick={toggleItalic}
                        style={italic ? { background: "grey" } : { background: "white" }}
                    >
                        <FormatItalic />
                    </IconButton>
                    <IconButton
                        className={"textFormatButton"}
                        onClick={() => {
                            if (displayColorPicker) {
                                setDisplayColorPicker(false)
                            } else {
                                setDisplayColorPicker(true)
                            }
                        }}>
                        <FormatColorTextIcon />
                    </IconButton>

                    {displayColorPicker ? <div style={popover} > <div style={cover} onClick={() => setDisplayColorPicker(false)} />
                        <TwitterPicker
                            className="colorPicker"
                            triangle={"hide"}
                            colors={['#D9E3F0', '#FFFFFF', '#000000', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                            onChange={handleColorChange}
                        /></div> : null
                    }

                    <FormControl className={"textFormatSelect"}>
                        <Select value={fontSize} onChange={changeFontSize}>
                            {fontSizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div>
                        <Button onClick={() => startRecording()} >Start recording</Button>
                        <Button onClick={() => stopRecording()} >Stop recording</Button>
                    </div>

                    <Stage width={600} height={500}>
                        <Layer ref={onRefChange}>
                            {videos.map((video) => {
                                console.log(video)
                                return <Video src={video} />
                            })}
                            {gifs.map((gif) => {
                                console.log(gif)
                                return <GIF src={gif} />
                            })}
                        </Layer>
                    </Stage>


                    {/*<ToggleButton selected={recordSelect} onChange={() => toggleRecording()} >{recordingStatus}</ToggleButton>*/}


                    <div>
                        <TextField
                            variant="outlined"
                            type="text"
                            style={{
                                display: 'block',
                            }}
                            placeholder=""
                            value={memeCaption1}
                            onChange={(event) => setMemeCaption1(event.target.value)}
                        />
                        <Button onClick={() => addText(1)} >add first caption</Button>
                        <Button onClick={() => removeText(1)} >remove first caption</Button>
                        <TextField
                            variant="outlined"
                            type="text"
                            style={{
                                display: 'block',
                            }}
                            placeholder=""
                            value={memeCaption2}
                            onChange={(event) => setMemeCaption2(event.target.value)}
                        />
                        <Button onClick={() => addText(2)} >add second caption</Button>
                        <Button onClick={() => removeText(2)} >remove second caption</Button>
                        <TextField
                            variant="outlined"
                            type="text"
                            style={{
                                display: 'block',
                            }}
                            placeholder=""
                            value={memeCaption3}
                            onChange={(event) => setMemeCaption3(event.target.value)}
                        />
                        <Button onClick={() => addText(3)} >add third caption</Button>
                        <Button onClick={() => removeText(3)} >remove third caption</Button>
                    </div>

                </Grid>
                <Grid>
                    {showGifTemplates()}
                    {showVideoTemplates()}
                </Grid>
            </Grid>
        </Container >
    );
}

export default VideoGenerator;
