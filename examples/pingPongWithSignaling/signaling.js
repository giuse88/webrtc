const ICE_CANDIDATE = "ice_candidate";
const ANSWER = "answer";
const OFFER = "offer";

class Signaling {

  constructor(config) {
    this.name = config.name;
    this.emiter = config.emiter;
    this.listener = config.listener;
  }

  onIceCandidate(cb) {
    this.listener.on(ICE_CANDIDATE, cb);
  }

  sendIceCandidate(candidate) {
    console.log(this.name + ": sending candidate");
    this.emiter.emit(ICE_CANDIDATE, candidate);
  }

  onAnswer(cb) {
    this.listener.on(ANSWER, cb);
  }

  onOffer(cb) {
    this.listener.on(OFFER, cb);
  }

  sendAnswer(answer) {
    console.log(this.name + ": sending answers");
    this.emiter.emit(ANSWER, answer);
  }

  sendOffer(offer) {
    console.log(this.name + ": sending offer");
    this.emiter.emit(OFFER, offer);
  }

}

export default Signaling;
