$(function() {
  var socket = io();

  $('#sendTweet').submit(function() {
    var tweet = $('#tweet');
    var content = tweet.val();

    socket.emit('tweet', { content });
    tweet.val('');

    return false;
  });

  socket.on('incomingTweets', function(data) {
    var html = `<div class="media">
                  <div class="media-left">
                    <a href="#"><img src=${data.user.photo} alt="" class="media-object"></a>
                  </div>
                  <div class="media-body">
                    <h4 class="media-heading">${data.user.name}</h4>
                    <p>${data.data.content}</p>
                  </div>
                </div>`;

    $('#tweets').prepend(html);
  });
});
