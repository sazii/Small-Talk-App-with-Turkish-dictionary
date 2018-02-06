'use strict';

const APIAI_TOKEN = '09b422d7b6074982947046e582f55d46';
const APIAI_SESSION_ID = '415bcfec-37d9-43bc-97d6-b52a2e826cff';
const express = require('express');
const app = express();
const Tureng = require('tureng');

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

const translateToTurkish = (aiText, socket) => {
  let turkishText = {};
  let words = [];
  let kelime = '';


  if(aiText.includes('!')) {aiText = aiText.slice(0,aiText.length-1)};
  console.log(aiText);
  kelime = new Tureng(aiText, 'entr'); // Tureng(word, lang); lang=ende for german, entr for english;
  let translations = []
  console.log(kelime)
  kelime.Translate((list) => {
    if(list.Translations) {
      //console.log('hey i am in turkish', list.Translations[1].TermTR.split('[')[0]);
      turkishText[aiText] = list.Translations[1].TermTR.split('[')[0];
      return turkishText;
    }
   });

     if(!turkishText.keys) {
      if (aiText.includes(' ')) {words = aiText.split(' ');}
      else {words[0] = aiText;}
      console.log(words);
      words.forEach(word => {

        if (word.includes('!')
        || word.includes('.')
        || word.includes(',')
        || word.includes('?')
        || word.includes(':'))
          {word = word.slice(0,word.length-1)}
          console.log(word);
        kelime = new Tureng(word, 'entr'); // Tureng(word, lang); lang=ende for german, entr for english
        kelime.Translate((list) => {
          if(list.Translations) {
          //console.log(word, ': ', list.Translations[0].TermTR);
          turkishText[word] = list.Translations[0].TermTR;
          }
          console.log('aaa', turkishText);
          socket.emit('turkish', turkishText);
          return turkishText;
      });

      });


}

};

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      let turkishText = translateToTurkish(aiText, socket);
      socket.emit('bot reply', aiText);
      console.log('tt', turkishText)
      //socket.emit('turkish', turkishText);
    });


    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
