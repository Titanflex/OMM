import React, { useState } from "react";
import {
    Popover,
    makeStyles,
} from "@material-ui/core";

import {FacebookShareButton, TwitterShareButton, RedditShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, RedditIcon, WhatsappIcon} from "react-share";


const useStyles = makeStyles((theme) => ({

}));



const SharePopover = props => {
    const classes = useStyles();
    const [memeData] = useState(props.memeData);
    const [memeUrl] = useState(props.memeUrl);

    const [anchorEl, setAnchorEl] = useState(props.anchorEl);

    const popOpen = Boolean(anchorEl);
    const id = popOpen ? 'share-popover' : undefined;
    

const handlePopClose = () => {
    setAnchorEl(null);
};

    return (
        <Popover
        id={memeData.id}
        open={popOpen}
        anchorEl={anchorEl}
        onClose={handlePopClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
    >
        <FacebookShareButton
            url={memeUrl}
            quote={"YoU cAN't cREatE GoOd mEMes wiTh An oNLiNE MEme cReAToR!!!!11!"}
            hashtag="#OMMeme"
            className={classes.socialMediaButton}>
            <FacebookIcon size={36} round/>
        </FacebookShareButton>
        <TwitterShareButton
            title={"OMMemes = Stonks"}
            url={memeUrl}
            hashtags={["OMMeme"]}
            className={classes.socialMediaButton}>
            <TwitterIcon size={36} round/>
        </TwitterShareButton>
        <RedditShareButton
            title={"OMMemes = Stonks"}
            url={memeUrl}
            className={classes.socialMediaButton}>
            <RedditIcon size={36} round/>
        </RedditShareButton>
        <WhatsappShareButton
            title={"OMMemes = Stonks"}
            url={memeUrl}
            separator={"\r\n"}
            className={classes.socialMediaButton}>
            <WhatsappIcon size={36} round/>
        </WhatsappShareButton>
    </Popover>
    );
}

export default SharePopover;
