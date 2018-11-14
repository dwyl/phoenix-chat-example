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

var channel = socket.channel('room:lobby', {}); // connect to chat "room"
channel.on('shout', function (payload) { // listen to the 'shout' event
  if (document.getElementById(payload.id) == null) { // check if message exists.
    var li = document.createElement("li"); // creaet new list item DOM element
    li.id = payload.id
    console.log(payload)
    var name = payload.name || 'guest';    // get name from payload or default
    li.innerHTML = '<p><b>' + name + '</b>: ' + payload.message + '</p> <br />';
    ul.appendChild(li);                    // append to list
  }
});

channel.join() // join the channel.
  .receive("ok", resp => { console.log("Joined chat!", resp) })

var ul = document.getElementById('msg-list');        // list of messages.
var name = document.getElementById('name');          // name of message sender
var msg = document.getElementById('msg');            // message input field

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    console.log(msg.value)
    channel.push('shout', { // send the message to the server
      name: name.value,     // get value of "name" of person sending the message
      message: msg.value    // get message text (value) from msg input field.
    });
    msg.value = '';         // reset the message input field for next message.
  }
});

  // .receive('ok', resp => {
  //   console.log('Joined successfully', resp);
  // })
  // .receive('error', resp => {
  //   console.error('Unable to join', resp);
  // });
