import React, {useEffect, useState} from "react";

import "./../../css/Overview/meme.css";


const Meme = props => {
    const [memeData] = useState(props.memeInfo);



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
