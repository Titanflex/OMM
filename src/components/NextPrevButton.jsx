import React from 'react';
import './NextPrevButton.css';


export const NextPrevButton = props => (
    <div className="btn-nextprev"
        onClick={() => props.handleClick()}>
        {props.children}
    </div>
)

export default NextPrevButton;