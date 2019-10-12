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
    li.innerHTML = '<p><b>' + sanitise(name)
      + '</b>: ' + sanitise(payload.message) + '</p> <br />';
    ul.appendChild(li);                    // append to list
  }
});

/*
  * When a user joins the channel, we ask Phoenix (our app) to push back the current state
  * of online users.
*/
channel.on('presence_state', function(onlineUsers){
  const currentlyOnlineUsers = Object.keys(onlineUsers)
  updateOnlineList(currentlyOnlineUsers)
})

/*
  * Every time a user joins (in case of this example, its when they send actual
  * message and not on channel join), phoenix broadcasts a diff of joins and leaves,
  * which can be used to modify the online users list in the view
*/
channel.on('presence_diff', function(userDiffPayload){
  const currentlyOnlineUsers = Object.keys(userDiffPayload.joins)
  const usersWhichLeft = Object.keys(userDiffPayload.leaves)
  updateOnlineList(currentlyOnlineUsers)
  removeOfflineUsers(usersWhichLeft)
})

// Helper function to append users to list
function updateOnlineList(users) {
  for (var i = users.length - 1; i >= 0; i--) {
    const userName = users[i]
    console.log("User: '"+userName+"' is in the room")

    if (document.getElementById(userName) == null) {
      var li = document.createElement("li"); // create new user list item DOM element
      li.id = userName
      li.innerHTML = `<caption>${sanitise(userName)}</caption>`
      usersList.appendChild(li);                    // append to  userslist
    }
  }
}

// Helper function to remove users which have left the chat room
function removeOfflineUsers(users) {
  for (var i = users.length - 1; i >= 0; i--) {
    const userName = users[i]
    console.log("User: '"+userName+"' left from the room")

    const userWhichLeft = document.getElementById(userName)
    if (userWhichLeft != null) {
      usersList.removeChild(userWhichLeft);         // remove the user from list
    }
  }
}

/**
 * sanitise input to avoid XSS see: https://git.io/fjpGZ
 * function borrowed from: https://stackoverflow.com/a/48226843/1148249
 * @param {string} str - the text to be sanitised.
 * @return {string} str - the santised text
 */
function sanitise(str) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match)=>(map[match]));
}


channel.join() // join the channel.
  .receive("ok", resp => { console.log("Joined chat!", resp) })

var ul = document.getElementById('msg-list');        // list of messages.
var name = document.getElementById('name');          // name of message sender
var msg = document.getElementById('msg');            // message input field
var usersList = document.getElementById('online-users');   // list of users.
// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    console.log(msg.value)
    channel.push('shout', { // send the message to the server
      name: sanitise(name.value), // get value of "name" of person sending
      message: sanitise(msg.value) // get message text (value) from msg input
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
