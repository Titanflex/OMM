import React, { useState, useRef, useEffect } from 'react';
import Button from "@material-ui/core/Button";

import "./../../css/ImageSelection/imageSelection.css";
import ClearIcon from "@material-ui/icons/Clear";
import { TextField } from "@material-ui/core";


const PaintCanvas = params => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [templateTitle, setTemplateTitle] = useState("")
    let [error, setError] = useState({
        show: false,
        text: "",
    });


    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = 500
        canvas.height = 300;
        canvas.style.background = "white";
        canvas.style.border = "1px solid black";

        const context = canvas.getContext("2d")

        context.lineCap = "round"; //round endings of lines
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;

    }, [])


    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    }

    const stopDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke();
    }
    const clearCanvas = () => {
        contextRef.current.clearRect(0, 0, 500, 300);
    }

    function saveDrawing() {

        if(templateTitle == ''){
            setError({show: true, text:"Please enter a title"});
        }
        let paintingSrc = canvasRef.current.toDataURL();
        params.handleSave(templateTitle, paintingSrc);
        clearCanvas();
    }

    return (
        <div>
            <Button
                className="classes.buttonStyle"
                startIcon={<ClearIcon />}
                onClick={clearCanvas}
                color="secondary"
            > Clear canvas
            </Button>
            <canvas ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw} />
            <TextField
                /* error={error.show}
                 helperText={error.text}*/
                id="standard-basic"
                label="Template Title"
                placeholder="Template Title"
                value={templateTitle}
                onChange={(event) => setTemplateTitle(event.target.value)}
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
