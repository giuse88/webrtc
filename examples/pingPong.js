console.log(" ===== Ping pong ==== ");

var webrtc = require("wrtc");

var RTCPeerConnection     = webrtc.RTCPeerConnection;
var RTCSessionDescription = webrtc.RTCSessionDescription;
var RTCIceCandidate       = webrtc.RTCIceCandidate;

// Utils
function handle_error(error)
{
  throw error;
}

var pc1 = new RTCPeerConnection();
var pc2 = new RTCPeerConnection();

// First step is to create add the handler for ice candidates

pc1.onicecandidate = function(candidate) {
  if(!candidate.candidate) return;
  pc2.addIceCandidate(candidate.candidate);
  console.log("PC2: Added ice canidate");
}

pc2.onicecandidate = function(candidate) {
  if(!candidate.candidate) return;
  pc1.addIceCandidate(candidate.candidate);
  console.log("PC1: Added ice canidate");
}

/** Answer and offer exchange */

//************************************
// PC1 =====> Send Offer =====> PC2
//                               |
//                               |
// PC1 <===== Receive Answer <=== PC2
//************************************

function createOfferPC1() {
  console.log('PC1: creating offer...');
  pc1.createOffer(handleOfferPC1, handle_error);
}

function createAnswerPC2() {
  console.log("PC2: creating answer...");
  pc2.createAnswer(handleAnswerPC2, handle_error);
}

function sendOffer(offer) {
  console.log("PC1: sending offer");
  onOfferPC2(offer);
}

function sendAnswer(answer) {
  onAnswer(answer);
}

function handleOfferPC1(offer) {
  console.log("PC1: offer created");
  setLocalDescriptionAndSendOfferPC1(offer);
}

function handleAnswerPC2(answer) {
  console.log("PC2: offer answer");
  setLocalDescriptionAndSendAnswerPC2(answer);
}

function setLocalDescriptionAndSendOfferPC1(desc){
  console.log('PC1: set local description');
  console.log(new RTCSessionDescription(desc));
  console.log(desc);
  pc1.setLocalDescription( new RTCSessionDescription(desc), sendOffer, handle_error);
}

function setLocalDescriptionAndSendAnswerPC2(desc){
  console.log('PC2: set local description');
  pc2.setLocalDescription( new RTCSessionDescription(desc), sendAnswer, handle_error);
}

function setRemoteDescriptionAndCreateAnswerPC2(desc){
  console.log('PC2: set remote description');
  console.log(new RTCSessionDescription(desc));
  console.log(desc);
  pc2.setRemoteDescription(new RTCSessionDescription(desc), createAnswerPC2, handle_error);
}

function onOfferPC2(offer) {
  console.log("PC2: offer received");
  setRemoteDescriptionAndCreateAnswerPC2(offer);
}

createOfferPC1();
