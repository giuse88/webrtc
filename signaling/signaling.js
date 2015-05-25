import ISignaling from "./iSignaling";

class Signaling extends ISignaling {

  onIceCandidate() {
    console.log("On ice candidate");
  }

  onAnswer() {
    console.log("On answer");
  }

  onOffer() {
    console.log("On offer");
  }

  sendAnswer() {
    console.log("Send Answer");
  }

  sendOffer() {
    console.log("Send Offer");
  }

}

export default Signaling;
