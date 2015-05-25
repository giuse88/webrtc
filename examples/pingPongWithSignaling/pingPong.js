console.log(" ===== Ping pong ==== ");

import Signaling from "./signaling";

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

pc1.oniceconnectionstatechange = () => console.log("PC1: " + pc1.iceConnectionState);
pc2.oniceconnectionstatechange = () => console.log("PC2: " + pc2.iceConnectionState);

import { EventEmitter } from "events";

var E1 = new EventEmitter();
var E2 = new EventEmitter();


var S1 = new Signaling({
  name:"PC1",
  emiter: E1,
  listener: E2
});

var S2 = new Signaling({
  name:"PC2",
  emiter: E2,
  listener: E1
});

S1.onIceCandidate( candidate => {
  pc1.addIceCandidate(new RTCIceCandidate(candidate));
  console.log("PC1: added ice canidate");
});

S2.onIceCandidate( candidate => {
  pc2.addIceCandidate(new RTCIceCandidate(candidate));
  console.log("PC2: added ice canidate");
});

S1.onAnswer(onAnswerPC1);
S2.onOffer(onOfferPC2);

pc1.onicecandidate = function(candidate) {
  if(!candidate.candidate) return;
  S1.sendIceCandidate(candidate.candidate)
  // console.log("PC1 Canidate : ", candidate.candidate);
}

pc2.onicecandidate = function(candidate) {
  if(!candidate.candidate) return;
  // console.log("PC2 Canidate : ", candidate.candidate);
  S2.sendIceCandidate(candidate.candidate)
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

console.log("Creating data channels");

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
  console.log("Data Channel open");
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
