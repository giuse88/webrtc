.PHONY: signaling ping-pong

default:
	 @echo "Examples: signaling ping-pong"

signaling:
	@nodemon --exec babel-node examples/signaling.js

ping-pong:
	@nodemon --exec babel-node examples/pingPong.js

