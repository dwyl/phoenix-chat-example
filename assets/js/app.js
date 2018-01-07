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

let channel = socket.channel('chat_room:lobby', {});
let list = $('#message-list');
let message = $('#msg');
let name = $('#name');

message.on('keypress', event => {
    if (event.keyCode == 13) {
        channel.push('shout', {
            name: name.val(),
            message: message.val()
        });
        message.val('');
    }
});

channel.on('shout', payload => {
    list.append(`<b>${payload.name || 'new_user'}:</b> ${payload.message}<br>`);
    list.prop({
        scrollTop: list.prop('scrollHeight')
    });
});

channel
    .join()
    .receive('ok', resp => {
        console.log('Joined successfully', resp);
    })
    .receive('error', resp => {
        console.log('Unable to join', resp);
    });
