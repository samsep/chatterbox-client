// YOUR CODE HERE:
$(document).ready(function() {

  var app = {};
  var timeStamp = "2012-10-07T17:24:40.668Z";
  var roomName = 'default';
  app.init = function () {
    this.server = 'https://api.parse.com/1/classes/chatterbox'
  };
  var friends = [];


app.clearMessages = function() {
  $('#chats').empty();
}

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

    response.results.forEach(function(chat) {

      if(chat.createdAt > timeStamp) {
        timeStamp = chat.createdAt;
        var $chat = $('<li></li>');
        var $username = $('<a href=#></a>');
        $username.addClass(chat.username);
        $username.text(chat.username);
        $chat.text(chat.roomname + ": " + chat.text);
        $chat.prepend($username);
        $chat.addClass(chat.roomname);
        $('.main ul').prepend($chat);
        var $room = $('<span></span>');
        $room.text(chat.roomname);
        if(!$('select').find('option:contains('+ $room.text() + ')').length > 0 && $room.text() !== "") {
          $('select').append('<option value=' + $room.text() + '>' + $room.text() + '</option>');
        }
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
      console.error('chatterbox: Failed to get message');
    }
  });
  };
  app.fetch(displayMessages);


  setInterval(function() {
    app.fetch(displayMessages);
  }, 800);

  app.handleSubmit = function() {
  };

  $('body').on("click", "button.sendMsg", function() {
    var usename = window.location.search.split("=").pop();
    var message = $('input.sendMsg').val();

    var rmname = $('select option:selected').text();

    event.preventDefault();
    console.log('clicked');
    app.send({username: usename, text: message, roomname: rmname});
    $('input').val('');
  });

  $('body').on('click', 'button.room', function(){
    var roomName = $('input.room').val();

    $('select').append('<option value=' + roomName + '>' + roomName + '</option>');
    $('select').val(roomName);
    $('select').change();
  });

  $('body').on('change', 'select', function(){

    filterByRoom();
    setInterval(filterByRoom, 1000);

  });

  var filterByRoom = function(){
    var selectedRoom = $('select option:selected').text();

    $('li:not('+selectedRoom+')').hide();
    $('li.'+selectedRoom).show();
  }

  $('body').on('click', 'a', function(){

    var friendClass = $(this).attr('class');
    friends.push(friendClass);
    setInterval(boldFriends, 100);
  });

var boldFriends = function () {

  $('a').each(function(ind, friend){
    console.log(friend);
    if (friends.indexOf($(friend).attr('class')) !== -1) {
      $(friend).closest('li').css("font-weight", "bold");
    }
  });
}

})



