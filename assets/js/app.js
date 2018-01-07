// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

var channel = socket.channel('chat_room:lobby', {});
var msg = document.getElementById('msg');
var name = document.getElementById('name');
var ul = document.getElementById('msg-list');

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    channel.push('shout', { // send the message to the server
      name: name.value,
      message: msg.value
    });
    msg.value = ''; // reset the message input field for next message.
  }
});

// listen to the 'shout'
channel.on('shout', function (payload) {
  var li = document.createElement("li"); // creaet new list item DOM element
  li.innerHTML = '<b>' + (payload.name || 'guest') + '</b>: ' + payload.message;
  ul.appendChild(li); // append to list
});

channel.join()
  .receive('ok', resp => {
    console.log('Joined successfully', resp);
  })
  .receive('error', resp => {
    console.log('Unable to join', resp);
  });
