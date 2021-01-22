import React, { useState } from "react";

import "./../../css/Overview/meme.css";


const Meme = props => {
    const [memeData] = useState(props.memeData);

    return (
        <div className="memeContainer" id="memeViewDiv" >
            <div>
                <textarea
                    className="memeText upper"
                    type="text"
                    value={memeData.upper}
                    readOnly
                />
            </div>
            <div id="memeDiv">
                <img
                    src={memeData.url}
                    alt={"meme image"}
                />
            </div>
            <textarea
                className="memeText lower"
                type="text"
                value={memeData.lower}
                readOnly
            />
        </div>
    );
}

export default Meme;
