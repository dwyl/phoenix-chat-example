// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
import socket from "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

function formatInsertedAtString(datetime) {
  const m = new Date(datetime)

  let dateString = m.getUTCFullYear() + "/" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + m.getUTCDate()).slice(-2);

  let timeString = ("0" + m.getUTCHours()).slice(-2) + ":" +
  ("0" + m.getUTCMinutes()).slice(-2) + ":" +
  ("0" + m.getUTCSeconds()).slice(-2);

  return {
    date: dateString,
    time: timeString
  }
}

formatInsertedAtString("2022-10-12T12:28:19")

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.show())
window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket


let channel = socket.channel('room:lobby', {}); // connect to chat "room"

channel.on('shout', function (payload) { // listen to the 'shout' event
  let li = document.createElement("li"); // create new list item DOM element

  // Get information from payload
  const name = payload.name || 'guest';    
  const message = payload.message 
  const date = formatInsertedAtString(payload.inserted_at).date
  const time = formatInsertedAtString(payload.inserted_at).time

  // HTML to insert
  let HTMLtoInsert = `
  <div class="flex justify-start mt-8 ml-4">
    <div class="flex flex-row items-start">
      <div class="w-[6rem]">
        <span class="font-semibold text-slate-600 break-words">
          ${name}
        </span>
      </div>
      <div class="bg-amber-200 relative mr-4 ml-4 h-full">
        <div class="absolute left-1/2 -ml-0.5 w-[0.1px] h-1/4 bg-gray-600"></div>
      </div>
      <div class="flex flex-col items-start max-w-[50vw]">
        <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
          <span class="block">
            ${message}
          </span>
        </div>
        <span class="text-xs font-thin mt-2">
          <span>${date}</span>
          <span class="text-gray-400">at</span>
          <span>${time}</span>
        </span>
      </div>
    </div>
  </div>
  `

  li.innerHTML = HTMLtoInsert

  // Append to list
  ul.appendChild(li);
});

channel.join(); // join the channel.


let ul = document.getElementById('msg-list');    // list of messages.
let name = document.getElementById('name');      // name of message sender
let msg = document.getElementById('msg');        // message input field

// function to be called on send
function sendMessage() {
  console.log('sendMessage')
  channel.push('shout', { // send the message to the server on "shout" channel
    name: name.value || "guest",     // get value of "name" of person sending the message. Set guest as default
    message: msg.value,    // get message text (value) from msg input field.
    inserted_at: new Date() // datetime of when the message was isnerted
  });
  msg.value = '';         // reset the message input field for next message.
  window.scrollTo(0, document.body.scrollHeight); // scroll to the end of the page on send
}

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    sendMessage()
  }
});

window.onload = function() {
  let send_btn = document.getElementById('send');  // send button
  send_btn.addEventListener('click', function (event) {
    sendMessage()
  });
}
