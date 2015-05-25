import { MethodNotImplemented } from "../utils";

class ISignaling {

  onInceCandidate() {
    throw new MethodNotImplemented("onIceCandidate");
  }

  onOffer() {
    throw new MethodNotImplemented("onOffer");
  }

  onAnswer() {
    throw new MethodNotImplemented("onAnswer");
  }

  sendAnswer() {
    throw new MethodNotImplemented("sendAnswer");
  }

  sendOffer() {
    throw new MethodNotImplemented("sendOffer");
  }

};

module.exports = ISignaling;
