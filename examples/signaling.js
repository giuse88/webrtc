import Signaling from "../signaling/signaling";

console.log(" ==== Signaling ====");

let signaling  = new Signaling();

signaling.onIceCandidate();
signaling.sendAnswer();
signaling.sendOffer();
signaling.onAnswer();
signaling.onOffer();
