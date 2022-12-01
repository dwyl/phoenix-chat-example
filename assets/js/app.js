import socket from "./user_socket.js"

const ul = document.getElementById('msg-list');    // list of messages.
const name = document.getElementById('name');      // name of message sender
const msg = document.getElementById('msg');        // message input field
const send = document.getElementById('send');      // send button
const channel = socket.channel('room:lobby', {});  // connect to chat "room"

channel.on('shout', function (payload) {           // listen for 'shout' event
  render_message(payload)
});

channel.join(); // join the channel.

function sendMessage() {
  channel.push('shout', {        // send the message to the server on "shout" channel
    name: name.value || "guest", // get value of "name" of person sending the message. Set guest as default
    message: msg.value,          // get message text (value) from msg input field.
    inserted_at: new Date()      // date + time of when the message was sent
  });
  msg.value = '';                // reset the message input field for next message.
  window.scrollTo(0, document.body.scrollHeight); // scroll to the end of the page on send
}

function render_message(payload) {
  const li = document.createElement("li"); // create new list item DOM element
  // Message HTML with Tailwind CSS Classes for layout/style:
  li.innerHTML = `
  <div class="flex flex-row w-[95%] mx-2 border-b-[1px] border-slate-300 py-2">
    <div class="text-left w-1/5 font-semibold text-slate-800 break-words">
      ${payload.name}
      <div class="text-xs mr-1">
        <span class="font-thin">${formatDate(payload.inserted_at)}</span> 
        <span>${formatTime(payload.inserted_at)}</span>
      </div>
    </div>
    <div class="flex w-3/5 mx-1 grow">
      ${payload.message}
    </div>
  </div>
  `
  // Append to list
  ul.appendChild(li);
}

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    sendMessage()
  }
});

send.addEventListener('click', function (event) {
  if (msg.value.length > 0) { // don't sent empty msg.
    sendMessage()
  }
});

// Date & Time Formatting 
function formatDate(datetime) {
  const m = new Date(datetime);
  return m.getUTCFullYear() + "/" 
    + ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" 
    + ("0" + m.getUTCDate()).slice(-2);
}

function formatTime(datetime) {
  const m = new Date(datetime);
  return ("0" + m.getUTCHours()).slice(-2) + ":"
    + ("0" + m.getUTCMinutes()).slice(-2) + ":"
    + ("0" + m.getUTCSeconds()).slice(-2);
}
