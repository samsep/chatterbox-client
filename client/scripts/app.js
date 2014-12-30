// YOUR CODE HERE:
$(document).ready(function() {

var app = {};
var timeStamp = "2012-10-07T17:24:40.668Z";
app.init = function () {
  this.server = 'https://api.parse.com/1/classes/chatterbox'
};

// var entityMap = {
//     "&": "&amp;",
//     "<": "&lt;",
//     ">": "&gt;",
//     '"': '&quot;',
//     "'": '&#39;',
//     "/": '&#x2F;'
//   };

//   function escapeHtml(string) {
//     return String(string).replace(/[&<>"'\/]/g, function (s) {
//       return entityMap[s];
//     });
//   }

app.clearMessages = function() {
  $('#chats').empty();
}

//this breaks the addMessage spec.
app.addMessage = function(message) {
  var $chat = $('<li></li>');
      $chat.text(message.username + ": " + message.roomname + ": " + message.text);
      $('#chats').prepend($chat);
}

app.addRoom = function(roomName) {
  $('#roomSelect').append('<div>' + roomName + '</div>')
}

app.send = function(message) {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var displayMessages = function (response) {
    // console.log(response);
    response.results.forEach(function(chat) {
      // var $chat = $('<li>' + escapeHtml(chat.username) + ": " + escapeHtml(chat.roomname) + ": " + escapeHtml(chat.text) + '</li>')
      // $('.main ul').append($chat);
      if(chat.createdAt > timeStamp) {
        timeStamp = chat.createdAt;
        var $chat = $('<li></li>');
        $chat.text(chat.username + ": " + chat.roomname + ": " + chat.text);
        $('.main ul').prepend($chat);
     }
    });
}

app.fetch = function(fetchCb) {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    // alex says we can put something at end of url to filter
    data: {order: '-createdAt'},
    type: 'GET',
    contentType: 'application/json',
    success: function (response) {
      // console.log(response);
      fetchCb(response);
    },
    error: function (response) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};
app.fetch(displayMessages);


setInterval(function() {
    app.fetch(displayMessages);
}, 1000);

app.handleSubmit = function() {
}
  $('body').on("click", "button", function() {
  var usename = window.location.search.split("=").pop();
  var message = $('input').text();
  var rmname = 'default';
    event.preventDefault();
    console.log('clicked');
    app.send({username: usename, text: message, roomname: rmname});
  });


})



