import React, {useState, useRef, useEffect} from 'react';
import Button from "@material-ui/core/Button";

import "./../../css/ImageSelection/imageSelection.css";
import "./../../css/ImageSelection/paintCanvas.css";
import ClearIcon from "@material-ui/icons/Clear";
import {IconButton, TextField} from "@material-ui/core";

import {TwitterPicker} from 'react-color';

import {ColorLens, LineWeight} from "@material-ui/icons";
import Slider from "@material-ui/core/Slider";

/**
 * component renders canvas
 * gets params from PaintCanvas component
 */
const PaintCanvas = params => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [title, setTitle] = useState("");
    const [strokeColor, setStrokeColor] = useState("black");
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [displaySlider, setDisplaySlider] = useState(false);
    const [error, setError] = useState({
        show: false,
        text: "",
    });

    const canvasRef = useRef(null);
    const contextRef = useRef(null);


    const handleColorChange = (color) => {
        setStrokeColor(color.hex);
    }

    function handleSliderChange(value) {
        setStrokeWidth(value);
        return `${value}`;
    }

    // setup canvas and context
    useEffect(() => {
        const canvas = canvasRef.current;
        let rect = canvas.getBoundingClientRect();
        let pixelDensity = 2;
        //increase pixel density to improve quality
        canvas.width = rect.width * pixelDensity;
        canvas.height = rect.height * pixelDensity;
        canvas.style.background = "white";
        canvas.style.border = "1px solid black";

        const context = canvas.getContext("2d")
        context.scale(pixelDensity, pixelDensity);
        context.lineCap = "round"; //round endings of lines
        contextRef.current = context;
    }, [])


    // onMouseDown
    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.lineWidth = strokeWidth;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    }

    // onMouseUp
    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    }

    // onMouseMove
    const draw = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke();
    }

    const clearCanvas = () => {
        contextRef.current.clearRect(0, 0, 500, 300);
    }

    /**
     * call handleSave in ImageSelection to save drawing as template
     * check for missing or duplicate template title
     */
    async function saveDrawing() {
        if (title === '') {
            setError({show: true, text: "Please enter a title"});
            return;
        }
        let isDuplicate = false;
        await fetch("http://localhost:3030/memeIO/get-templates").then(res => {
            res.json().then(json => {
                json.docs.forEach(template => {
                    if (template.templateName === title && !isDuplicate) {
                        setError({show: true, text: "Template title is already used"});
                        isDuplicate = true;
                    }
                });
            }).then(() => {
                    if (!isDuplicate) {
                        let paintingSrc = canvasRef.current.toDataURL();
                        params.handleSave(title, paintingSrc, false);
                        clearCanvas();
                    }
                }
            )
        })
    }

    return (
        <div>
            <IconButton
                className={"textFormatButton"}
                onClick={() => {
                    if (displayColorPicker) {
                        setDisplayColorPicker(false)
                    } else {
                        setDisplayColorPicker(true)
                    }
                }}>
                <ColorLens/>
            </IconButton>
            {displayColorPicker ? <div className="popover">
                <div className="cover" onClick={() => setDisplayColorPicker(false)}/>
                <TwitterPicker
                    className="colorPicker"
                    triangle={"hide"}
                    colors={['#D9E3F0', '#FFFFFF', '#000000', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                    onChange={handleColorChange}
                /></div> : null
            }
            <IconButton
                className={"textFormatButton"}
                onClick={() => setDisplaySlider(!displaySlider)}>
                <LineWeight/>
            </IconButton>
            {displaySlider ? <div className="popover">
                <div className="cover" onClick={() => setDisplaySlider(false)}/>
                <Slider
                    defaultValue={strokeWidth}
                    getAriaValueText={handleSliderChange}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={20}
                    style={{width: "200px", margin: "10px"}}
                    disp
                /></div> : null
            }
            <Button
                className="classes.buttonStyle"
                style={{float: "right"}}
                startIcon={<ClearIcon/>}
                onClick={clearCanvas}
                color="secondary"
            > Clear canvas
            </Button>
            <canvas ref={canvasRef}
                    style={{width: 500, height: 300}}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}/>
            <TextField
                error={error.show}
                helperText={error.text}
                id="standard-basic"
                label="Template Title"
                placeholder="Template Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
            <Button
                className="classes.buttonStyle modal"
                variant="contained"
                onClick={saveDrawing}
                color="secondary"
            >
                Save drawing
            </Button>
        </div>
    );
}

export default PaintCanvas;
