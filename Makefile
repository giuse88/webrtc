.PHONY: signaling ping-pong

default:
	 @echo "Examples: signaling ping-pong"

signaling:
	@nodemon --exec babel-node examples/signaling.js

ping-pong:
	@babel-node examples/pingPong.js

ping-pong-watch:
	@nodemon --exec babel-node examples/pingPong.js

ping-pong-with-signaling:
	@babel-node examples/pingPongWithSignaling/pingPong.js

ping-pong-with-signaling-watch:
	@nodemon --exec babel-node examples/pingPongWithSignaling/pingPong.js
