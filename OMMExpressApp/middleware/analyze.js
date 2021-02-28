const path = require("path");
const createReadStream = require('fs').createReadStream
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const key = "45c3473e2b3a4a1b96f663e24c8da103";
const endpoint = "https://omm-memegenerator.cognitiveservices.azure.com/";
if (!key) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }


const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

/**
 * analyzes meme with computer vision
 * @param title tile of meme which is analyzed
 * @returns analysis with description and tags of meme
 */
async function analyze(title) {
    const url = path.join(__dirname, '../public/images/memes/' + title + '.jpeg');
    const analysis = (await computerVisionClient.analyzeImageInStream(
        () => createReadStream(url), { visualFeatures: ['Tags', "Description"] }));
    return analysis;

}

module.exports = analyze;