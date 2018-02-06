/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// webpack-livereload-plugin
/******/ 	(function() {
/******/ 	  if (typeof window === "undefined") { return };
/******/ 	  var id = "webpack-livereload-plugin-script";
/******/ 	  if (document.getElementById(id)) { return; }
/******/ 	  var el = document.createElement("script");
/******/ 	  el.id = id;
/******/ 	  el.async = true;
/******/ 	  el.src = "//" + location.hostname + ":35729/livereload.js";
/******/ 	  document.getElementsByTagName("head")[0].appendChild(el);
/******/ 	}());
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'tr-TR';
const socket = io();
const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

//initiates speech recognition
document.querySelector('button').addEventListener('click', () => {
  recognition.start();
  console.log("STARTING asss", recognition);
});

recognition.addEventListener('result', e => {
  //console.log(e.results);
  const transcript = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
  outputYou.textContent = transcript;
  console.log('Confidence: ' + e.results[0][0].confidence);

  if (transcript.includes('unicorn')) {
    console.log('Unicorn');
  }
  //console.log(transcript);
  socket.emit('chat message', transcript);
});

//recognition.addEventListener('end', recognition.start);

//recognition.stop();

recognition.addEventListener('error', err => {
  outputBot.textContext = 'Error' + err;
});

var synthVoice = text => {
  const synth = window.speechSynthesis;
  const utterence = new SpeechSynthesisUtterance();
  utterence.text = text;
  synth.speak(utterence);
};

socket.on('bot reply', replyText => {
  synthVoice(replyText);
  console.log('reply', replyText);
  if (replyText === '') replyText = '(Sorry, no answer)';

  let box = document.getElementsByClassName('output-bot')[0];
  box.innerHTML = replyText;
});

//stores to result event what was said as text
//returns SpeechRecognitionResultsList obj including result; text will be in array.
// confidence: privacy

/*recognition.addEventListener('result', (evt) => {
    console.log('Result has been detected.');

    //let last = evt.results.length - 1;
    let text = Array.from(evt.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

    outputYou.textContent = text;
    console.log('Confidence: ' + evt.results[0][0].confidence);

    socket.emit('chat message', text);
  });

  /*recognition.addEventListener('speeched', () => {
    speRec.stop();
  });

  recognition.addEventListener('error', (err) => {
    outputBot.textContext = 'Error' + err;
  });



var synthVoice = (text) => {
  const synth = window.speechSynthesis;
  const utterence = new SpeechSynthesisUtterance();
  utterence.text = text;
  synth.speak(utterence);
};

socket.on('bot reply', (replyText) => {
  synthVoice(replyText);

  if (replyText === '') replyText = '(Sorry, no answer)';

  outputBot.textContext = replyText;
});*/

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map