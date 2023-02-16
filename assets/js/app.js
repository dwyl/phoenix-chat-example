import socket from "./user_socket.js"

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.delayedShow(200))
window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket


/* INITIAL SETUP OF VARIABLES AND JOINING CHANNEL -------------- */
const ul = document.getElementById('msg-list');                       // list of messages.
const name = document.getElementById('name');                         // name of message sender
const msg = document.getElementById('msg');                           // message input field
const send = document.getElementById('send');                         // send button
const peopleListMobile = document.getElementById('people_online-list-mobile');      // online people list mobile
const peopleListDesktop = document.getElementById('people_online-list-desktop');      // online people list desktop

const channel = socket.channel('room:lobby', {});  // connect to chat "room"
channel.join(); // join the channel.



/* ONLINE people / PRESENCE FUNCTIONS -------------- */


// This function will be probably caught when the person first enters the page
channel.on('presence_state', function (payload) {
  // Array of objects with id and username
  const currentlyOnlinePeople = Object.entries(payload).map(elem => ({username: elem[0], id: elem[1].metas[0].phx_ref}))
    
  updateOnlinePeopleList(currentlyOnlinePeople)
})

// Listening to presence events whenever a person leaves or joins
channel.on('presence_diff', function (payload) {
  if(payload.joins && payload.leaves) {
    // Array of objects with id and username
    const currentlyOnlinePeople = Object.entries(payload.joins).map(elem => ({username: elem[0], id: elem[1].metas[0].phx_ref}))
    const peopleThatLeft = Object.entries(payload.leaves).map(elem => ({username: elem[0], id: elem[1].metas[0].phx_ref}))

    updateOnlinePeopleList(currentlyOnlinePeople)
    removePeopleThatLeft(peopleThatLeft)
  }
});

function updateOnlinePeopleList(currentlyOnlinePeople) {
    // Add joined people
    for (var i = currentlyOnlinePeople.length - 1; i >= 0; i--) {
      const name = currentlyOnlinePeople[i].username
      const id = name + "-" + currentlyOnlinePeople[i].id
  
      if (document.getElementById(name) == null) {
        var liMobile = document.createElement("li"); // create new person list item DOM element for mobile
        var liDesktop = document.createElement("li"); // create new person list item DOM element for desktop
        
        liMobile.id = id + '_mobile'
        liDesktop.id = id + '_desktop'
        liMobile.innerHTML = `<caption>${sanitizeString(name)}</caption>`
        liDesktop.innerHTML = `<caption>${sanitizeString(name)}</caption>`

        peopleListMobile.appendChild(liMobile);                    // append to people list
        peopleListDesktop.appendChild(liDesktop);                    // append to people list
      }
    }
}

function removePeopleThatLeft(peopleThatLeft) {
  // Remove people that left
  for (var i = peopleThatLeft.length - 1; i >= 0; i--) {
    const name = peopleThatLeft[i].name
    const id = name + "-" + peopleThatLeft[i].id

    const personThatLeftMobile = document.getElementById(id + '_mobile')
    const personThatLeftDesktop = document.getElementById(id +  '_desktop')

    if (personThatLeftMobile != null && personThatLeftDesktop != null) {
      peopleListMobile.removeChild(personThatLeftMobile);         // remove the person from list mobile
      peopleListDesktop.removeChild(personThatLeftDesktop);        // remove the person from list desktop
    }
  }
}

/* SENDING MESSAGES FUNCTIONS ------------- */

// Listening to 'shout' events
channel.on('shout', function (payload) {
  render_message(payload)
});

// Send the message to the server on "shout" channel
function sendMessage() {

  channel.push('shout', {        
    name: name.value || "guest", // get value of "name" of person sending the message. Set guest as default
    message: msg.value,          // get message text (value) from msg input field.
    inserted_at: new Date()      // date + time of when the message was sent
  });

  msg.value = '';                // reset the message input field for next message.
}

// The page does not automatically scroll to show the latest message
// So invoke this after rendering messages to ensure the last one is in view:
function scroll_latest_message_into_view() {
  window.scrollTo(0, document.documentElement.scrollHeight) // desktop
  ul.scrollTo(0, ul.scrollHeight)                           // mobile
}

// Render the message with Tailwind styles
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
  scroll_latest_message_into_view();
}

// Listen for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    sendMessage()
  }
});

// On "Send" button press
send.addEventListener('click', function (event) {
  if (msg.value.length > 0) { // don't sent empty msg.
    sendMessage()
  }
});


/* UTILS ------------ */

// Date formatting
function formatDate(datetime) {
  const m = new Date(datetime);
  return m.getUTCFullYear() + "/" 
    + ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" 
    + ("0" + m.getUTCDate()).slice(-2);
}

// Time formatting
function formatTime(datetime) {
  const m = new Date(datetime);
  return ("0" + m.getUTCHours()).slice(-2) + ":"
    + ("0" + m.getUTCMinutes()).slice(-2) + ":"
    + ("0" + m.getUTCSeconds()).slice(-2);
}

// Sanitize string input borrowed from:
// stackoverflow.com/questions/23187013/sanitize-javascript-string
function sanitizeString(str){
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
  return str.trim();
}