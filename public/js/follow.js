$(function() {
  $(document).on('click', '#follow', function(e) {
    e.preventDefault();

    var userId = $('#user_id').val();
    var followBtn = $('#follow');

    if (!followBtn) {
      return;
    }

    followBtn[0].disabled = true;

    $.ajax({
      type: 'POST',
      url: '/follow/' + userId,
      success: function(data) {
        followBtn
          .removeClass('btn-default')
          .addClass('btn-primary')
          .html('Following')
          .attr('id', 'unfollow');
        followBtn[0].disabled = false;
      },
      error: function(data) {
        followBtn[0].disabled = false;
        
        console.log(data);
      }
    });
  });

  $(document).on('click', '#unfollow', function(e) {
    e.preventDefault();

    var userId = $('#user_id').val();
    var unfollowBtn = $('#unfollow');

    if (!unfollowBtn) {
      return;
    }

    unfollowBtn[0].disabled = true;

    $.ajax({
      type: 'POST',
      url: '/unfollow/' + userId,
      success: function(data) {
        unfollowBtn
          .removeClass('btn-primary btn-danger')
          .addClass('btn-default')
          .html('Follow')
          .attr('id', 'follow');
        unfollowBtn[0].disabled = false;
      },
      error: function(data) {
        unfollowBtn[0].disabled = false;
        
        console.log(data);
      }
    });
  });

  $(document).on('mouseenter', '#unfollow', function(e) {
    $(this).removeClass('btn-primary').addClass('btn-danger').html('Unfollow');
  });

  $(document).on('mouseleave', '#unfollow', function(e) {
    $(this).removeClass('btn-danger').addClass('btn-primary').html('Following');
  });
});