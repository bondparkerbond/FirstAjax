$(document).ready( function() {
  var baseUrl = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1/users/';

  $('#get_users').on('click', function() {
    $('#users').empty()
    $('#add_sort').removeClass('hide')
    $.ajax(baseUrl,
           {
             type: 'GET',
             success: function(data) {
               for(index in data.users) {
                 var user = data.users[index];
                 $('#users').append("<li class='person' data-user-id='" + user.id + "' data-first-name='" + user.first_name + "'>" + user.first_name + "<button class='delete'>Delete</button><button id='show'>Show</button></li>");
               }
             },
             error: function(data) {

             }
           });
  });

  function showUser(user) {
    $.ajax('/get_user', {
      type: 'GET',
      data: user,
      success: function(data) {
        $('body').html(data);
      }
    });
  }

  $(document).on('click', '#show', function() {
    var id = $(this).closest('.person').data('user-id');
    $.ajax(baseUrl + id, {
      type: 'GET',
      success: function(data) {
        showUser(data.user);
      },
      error: function(data) {
      }
    });


  });


  $(document).on('click', '.person', function() {
   $('#edit_user').removeClass('hide');

   $.ajax(baseUrl + $(this).data('user-id'),
          {
            type: 'GET',
            success: function(data) {
              $('#first_name').val(data.user.first_name);
              $('#last_name').val(data.user.last_name);
              $('#phone_number').val(data.user.phone_number);
              $('.edit').data('user-id', data.user.id);
            }
          }
         )
  });

  $('.edit').on('click', function() {
    var first = $('#first_name').val();
    var last = $('#last_name').val();
    var phone = $('#phone_number').val();
  
   var user = { user: {first_name: first, last_name: last, phone_number: phone }};
   $.ajax(baseUrl + $(this).data('user-id'),
          {
            type: 'PUT',
            data: user,
            success: function(data) {
              $('#edit_user').addClass('hide');
            }
          });
  });

  $(document).on('click', '.delete', function() {
    var id = $(this).closest('.person').data('user-id');
    var that = $(this);
   $.ajax(baseUrl + id,
          {
            type: 'DELETE',
            success: function(data) {
              that.closest('.person').remove();
            }
          });

  });

  function compare(a,b) {
    if (a.first_name < b.first_name)
      return -1;
    if (a.first_name >b.first_name)
      return 1;
    return 0;
  }

  $('#add_sort').on('click', function() {
    var people = $('.person');
    var sortarr = [];
    for (var i = 0; i < people.length; i++) {
      sortarr.push({first_name: people[i].dataset.firstName, id: people[i].dataset.userId});
    }
      
    
    var newarr = sortarr.sort(compare);
    console.log(newarr);
    $('#users').empty()
    for(index in newarr) {
      var user = newarr[index];
      $('#users').append("<li class='person' data-user-id='" + user.id + "'>" + user.first_name + "<button class='delete'>Delete</button><button id='show'>Show</button></li>");
    }
      $('#add_sort').addClass('hide')
    //        {
    //          type: 'GET',
    //          success: function(data) {
    //            $('body').append(data);
    //          }
    //        });
  });

  $('.add').on('click', function(){
    var firstName = $('#new_first_name').val();
    var lastName = $('#new_last_name').val();
    var phoneNumber = $('#new_phone_number').val();
    var user = { user: {first_name: firstName, last_name: lastName, phone_number: phoneNumber }};
    //moved 3 variables to the top, will be renaming them
    $.ajax(baseUrl, {
       type: 'POST',
       data: user,
       success: function(data) {
        var user = data.user;
        $('#users').append("<li class='person' data-user-id='" + user.id + "'>" + user.first_name + "<button class='delete'>Delete</button></li>");

       }
    });
  });

});
