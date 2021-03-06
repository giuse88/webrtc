console.log(" ===== Ping pong ==== ");

var webrtc = require("wrtc");

var RTCPeerConnection     = webrtc.RTCPeerConnection;
var RTCSessionDescription = webrtc.RTCSessionDescription;
var RTCIceCandidate       = webrtc.RTCIceCandidate;

var howManyPing = 10;

// Utils
function handle_error(error)
{
  throw error;
}

var pc1 = new RTCPeerConnection();
var pc2 = new RTCPeerConnection();

// First step is to create add the handler for ice candidates

pc1.oniceconnectionstatechange = function() {
  console.log("PC1: " + pc1.iceConnectionState)
}
pc2.oniceconnectionstatechange = function() {
 console.log("PC2: " + pc2.iceConnectionState);
}

pc1.onicecandidate = function(candidate) {
  if(!candidate.candidate) return;
  console.log("PC1: Candidate : ", candidate.candidate);
  console.log("PC2: Added ice canidate");
  pc2.addIceCandidate(candidate.candidate);
}

pc2.onicecandidate = function(candidate) {
  if(!candidate.candidate) return;
  console.log("PC2 Candidate : ", candidate.candidate);
  console.log("PC1: Added ice canidate");
  pc1.addIceCandidate(candidate.candidate);
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
  onAnswerPC1(answer);
}

function handleOfferPC1(offer) {
  console.log("PC1: offer created");
  setLocalDescriptionAndSendOfferPC1(offer);
}

function handleAnswerPC2(answer) {
  console.log("PC2: answer created");
  setLocalDescriptionAndSendAnswerPC2(answer);
}

function setLocalDescriptionAndSendOfferPC1(desc){
  console.log('PC1: set local description');
  pc1.setLocalDescription( new RTCSessionDescription(desc),
    sendOffer.bind(this, desc), handle_error);
}

function setLocalDescriptionAndSendAnswerPC2(desc){
  console.log('PC2: set local description');
  pc2.setLocalDescription( new RTCSessionDescription(desc),
    sendAnswer.bind(this, desc), handle_error);
}

function setRemoteDescriptionAndCreateAnswerPC2(desc){
  console.log('PC2: set remote description');
  pc2.setRemoteDescription(new RTCSessionDescription(desc), createAnswerPC2, handle_error);
}

function setRemoteDescriptionPC1(desc) {
  console.log('PC1: set remote description');
  pc1.setRemoteDescription(new RTCSessionDescription(desc), peersConnected, handle_error);
}

function onOfferPC2(offer) {
  console.log("PC2: offer received");
  setRemoteDescriptionAndCreateAnswerPC2(offer);
}

function onAnswerPC1(answer) {
  console.log("PC1: answer received");
  setRemoteDescriptionPC1(answer);
}

function peersConnected() {
  console.log(pc1.iceConnectionState);
  console.log(pc2.iceConnectionState);
  console.log("Peers connected");
}

/***************************************
 *          Data Channels              *
 ***************************************/

var dc1 = pc1.createDataChannel("test");
var dc2 = null;

dc1.onerror = function (error) {
  console.log("DC1: Data Channel Error:", error);
};

dc1.onmessage = function (event) {
  var data = event.data;
  console.log("DC1: received '"+data+"'");
  console.log("DC1: sending 'pong'");
  dc1.send("pong");
};

dc1.onopen = function () {
  dc1.send("DC1: data channle opened");
};

dc1.onclose = function () {
  console.log("The Data Channel is Closed");
};

pc2.ondatachannel = function(event) {
  dc2 = event.channel;
  dc2.onopen = function() {
    console.log("PC2: data channel open");
    dc2.onmessage = function(event) {
      var data = event.data;
      console.log("DC2: received '"+data+"'");
      if ( howManyPing > 0) {
        sendPing();
        howManyPing--;
      } else {
        end();
      }
    }
    sendPing();
  };
}

function sendPing() {
  console.log("DC2: sending 'ping'");
  dc2.send("ping");
}

function run() {
  createOfferPC1();
}

function end() {
  console.log('cleanup');
  pc1.close();
  pc2.close();
  console.log('done');
}

run();
