import React, {useEffect, useState} from "react";

import "./../../css/Overview/meme.css";


const Meme = props => {
    const [memeData] = useState(props.memeData);
    const synth = window.speechSynthesis;
    const [isAccessible] = useState(props.isAccessible);

    useEffect(()=>{
        console.log(isAccessible);
        if(isAccessible){
            const text = new SpeechSynthesisUtterance(memeData.title);
            text.voice = synth.getVoices()[3];
            synth.cancel();
            synth.speak(text)
        }
        }, [memeData]);


    return (
        <div className="memeContainer" id="memeViewDiv" >
            <div id="memeDiv">
                <img
                    src={memeData.url}
                    alt={"meme image"}
                />
            </div>

        </div>
    );
}

export default Meme;
