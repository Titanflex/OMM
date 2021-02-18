
import {computerVision, isConfigured as ComputerVisionIsConfigured } from '../../services/azure.service.js';
import {useState} from "react";

const ComputerVision = params => {

    const [analysis, setAnalysis] = useState(null);
    const [processing, setProcessing] = useState(false);


    async function onFileUrlEntered (e) {
        // hold UI
        setProcessing(true);
        setAnalysis(null);
        //console.log(params.url);

        /*await fetch("http://localhost:3030/memeIO/generate", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: `${params.url}`,
            }),
        }).then((res) => {
            console.log(res);
            return res.text();
        }).then((data) => {
            console.log(data);
            setFileSelected(data);
            console.log(fileSelected);
        });*/


        computerVision("https://i.imgflip.com/4y3xpi.jpg").then((item) => {
            // reset state/form
            setAnalysis(item);
            setProcessing(false);
            console.log(item);
            console.log(analysis);
        });

    };




    const Analyze = () => {
        return (
            <div>
                <h1>Analyze image</h1>
                {!processing &&
                <div>
                    <button onClick={onFileUrlEntered}>Analyze</button>
                </div>
                }
                {processing && <div>Processing</div>}
                <hr />
            </div>
        )
    }

    const CantAnalyze = () => {
        return (
            <div>Key and/or endpoint not configured in ./azure-cognitiveservices-computervision.js</div>
        )
    }

    function Render() {
        const ready = ComputerVisionIsConfigured();
        if (ready) {
            return <Analyze />;
        }
        return <CantAnalyze />;
    }

    return (
        <div>
            {Render()}
        </div>

    );
}

export default ComputerVision;