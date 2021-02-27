import React, { useState, useCallback } from "react";
import {
    Grid, GridList, GridListTile, GridListTileBar, Button,
    Container,
    FormControl,
    MenuItem,
    Select,
    IconButton,
    TextField,

} from "@material-ui/core";

import ToggleButton from '@material-ui/lab/ToggleButton';
import axios from 'axios';

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

/**
 * Draws a video on a canvas.
 * @param {String} src The url of the video
 */
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

    // when video is loaded, read it size
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

/**
 * Draws a gif on the canvas.
 * @param {String} src The url of the gif 
 */
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

/**
 * Creates so called MIMs alias memes in motion
 */
function VideoGenerator() {

    const [gifs, setGifs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [download, setDownload] = useState(false);
    const [textFormat, setTextFormat] = useState("")
    const [color, setColor] = useState("white");
    const [fontSize, setFontSize] = useState(30);
    const [titleError, setTitleError] = useState({
        show: false,
        text: "",
    });

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

    /**
     * Handles missing memetitle
     */
    const handleMissingTitle = () => {
        setTitleError({
            show: true,
            text: "Enter a meme title",
        });
    }

    /**
     * Toggles the boldness of text
     */
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

    /**
     * Toggles the italicness of text
     */
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

    /**
     * Toggles the download button
     */
    function toggleDownload() {
        if (canvasRecorder === null) {
            download ? setDownload(false) : setDownload(true);
        } else
            alert("This option is not available during recordings")

    }

    /**
     * Handles changes in the fontsize
     * @param {event} event The clicked event fontsize
     */
    const changeFontSize = (event) => {
        if (canvasRecorder === null)
            setFontSize(event.target.value);
        else
            alert("This option is not available during recordings")
    };

    /**
     * Handles changes in the textcolor
     * @param {color} color The chosen color
     */
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
    const [memeName, setMemeName] = useState("");

    let canvasRecorder = null;

    let file = null;

    /**
     * Starts the canvas recording
     */
    const startRecording = (() => {
        if (!memeName) {
            handleMissingTitle();
            return;
        }
        if (canvasRef !== null) {
            let canvas = canvasRef.getCanvas()._canvas;
            canvasRecorder = createCanvasRecorder(canvas, { filename: memeName, download: download });
            canvasRecorder.start();
        }
    })

    /**
     * Ends the canvas recording
     */
    const stopRecording = (() => {
        if (canvasRecorder !== null) {
            var blob = canvasRecorder.stop();
            var timeout = setInterval(function () {
                if (blob.length >= 0) {
                    clearInterval(timeout);
                    file = new File(blob, memeName + ".webm")
                    canvasRecorder.dispose()
                    canvasRecorder = null;
                }
            }, 100);
        }
    })

    /**
     * Uploads a videofile to the express backend using axios
     */
    const upload = (() => {
        if (file !== null) {
            const data = new FormData()
            data.append('file', file)
            axios.post("http://localhost:3030/memeIO/upload-mim", data, {
                headers: {
                    'x-auth-token': localStorage.token,
                    title: memeName,
                    'type': 'mim',

                }
            }).then(res => { // then print response status
                if (res.status === 500)
                    alert("Sorry, but your upload failed :(")
                else
                    alert("Successfully uploaded")

            })
        }
    })

    /**
     * Mainly needed for debuggin the canvas, also has future uses.
     */
    const onRefChange = useCallback(node => {
        // ref value changed to node
        setCanvasRef(node); // e.g. change ref state to trigger re-render
        if (node === null) {
            // node is null, if DOM node of ref had been unmounted before
        } else {
            // ref value exists
        }
    }, []);

    /**
     * Adds text 1,2 or 3 to the canvas if it doesn't already exist.
     * @param {Integer} nbr The number of the caption
     */
    const addText = (nbr) => {
        let textCaption = null
        if (nbr === 1) {
            textCaption = memeCaption1
        } else if (nbr === 2) {
            textCaption = memeCaption2
        } else {
            textCaption = memeCaption3
        }

        let text = new Text({ text: textCaption, fontSize: fontSize, fontFamily: "impact", fill: color, draggable: true, fontStyle: textFormat, id: nbr })
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

    /**
     * Removes text 1,2 or 3 if they are on the canvas.
     * @param {Integer} nbr The number of the caption.
     */
    const removeText = (nbr) => {
        canvasRef.getChildren(function (node) {
            if (node.getAttr("id") === nbr)
                node.remove()
        })
    }

    const gifTemplates = [
        { url: "http://localhost:3030/images/templates/gifs/Maus.gif", name: "Maus" },
        { url: "http://localhost:3030/images/templates/gifs/excuse.gif", name: "Excuse me" },
        { url: "http://localhost:3030/images/templates/gifs/wtf.gif", name: "Wtf" },
        { url: "http://localhost:3030/images/templates/gifs/omg.gif", name: "OMG" },
        { url: "http://localhost:3030/images/templates/gifs/thisisfine.gif", name: "This is fine" },
        { url: "http://localhost:3030/images/templates/gifs/ohhh.gif", name: "Ohhh" },
        { url: "http://localhost:3030/images/templates/gifs/stonks.gif", name: "Stonks" },
        { url: "http://localhost:3030/images/templates/gifs/proud.gif", name: "Proud of you" },
        { url: "http://localhost:3030/images/templates/gifs/rick.gif", name: "Never gonna give" }
    ]

    /**
     * Creates a gridlist with all gifs in gifTemplates. On click adds a gif to the canvas.
     */
    const showGifTemplates = () => (
        <GridList cellHeight={180} cols={3} style={{ height: 400, width: 420, "margin": "10px" }}>
            {gifTemplates.map((template) => (
                <GridListTile key={template.name} style={{ 'cursor': 'pointer', width: 200 }} cols={1}
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

    const videoTemplates = [
        { url: "http://localhost:3030/images/templates/vids/think.Mp4", name: "Ain't allowed to think" },
        { url: "http://localhost:3030/images/templates/vids/crying.Mp4", name: "Kid with knife" },
        { url: "http://localhost:3030/images/templates/vids/kill.Mp4", name: "Kill myself" },
        { url: "http://localhost:3030/images/templates/vids/blinded.Mp4", name: "Blinded by the lights" },
        { url: "http://localhost:3030/images/templates/vids/serious.Mp4", name: "You serious?" },
        { url: "http://localhost:3030/images/templates/vids/stopit.Mp4", name: "Stop it" }]

    /**
* Creates a gridlist with all videos in videoTemplates. On click adds a video to the canvas.
*/
    const showVideoTemplates = () => (
        <GridList cellHeight={180} cols={2} style={{ height: 400, width: 420, "margin": "10px" }}>
            {videoTemplates.map((template) => (
                <GridListTile key={template.id} style={{ 'cursor': 'pointer', width: 400 }} cols={1}
                    onClick={() => {

                        setVideos(videos.concat([template.url]))
                    }}
                >
                    <video width="400" height="300" loop muted autoPlay> <source src={template.url} alt={(template.name) ? template.name : template.templateName} /> </video>
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
            <Grid container alignItems="flex-start" spacing={6} justify="center">
                <Grid>
                    <p>1. Select a gif...</p>
                    {showGifTemplates()}
                    <p>...or a video or both!</p>
                    {showVideoTemplates()}
                </Grid>
                <Grid>
                    <div>
                        <p>2. Write your captions</p>
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
                <Grid item s={8} style={{ overflow: "hidden" }}>
                    <p>3. Enter a title and start recording!</p>

                    <div><TextField
                        error={titleError.show}
                        helperText={titleError.text}
                        variant="outlined"
                        type="text"
                        style={{
                            display: 'block',
                        }}
                        placeholder="Name of your meme"
                        value={memeName}
                        onChange={(event) => setMemeName(event.target.value)}
                    />
                        <Button onClick={() => upload()} >Upload</Button>
                    </div>

                    <div>
                        <Button onClick={() => startRecording()} >Start recording</Button>
                        <Button onClick={() => stopRecording()} >Stop recording</Button>
                        <ToggleButton selected={download} onChange={() => toggleDownload()}>Download after rec</ToggleButton>


                    </div>
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

                    <Stage width={500} height={500} style={{ border: "1px solid black" }}>
                        <Layer ref={onRefChange} >
                            {videos.map((video) => {
                                return <Video src={video} />
                            })}
                            {gifs.map((gif) => {
                                return <GIF src={gif} />
                            })}
                        </Layer>
                    </Stage>
                </Grid>

            </Grid>
        </Container >
    );
}

export default VideoGenerator;
