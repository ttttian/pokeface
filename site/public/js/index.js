$(window).load(function() {
  var userID, accessToken, userPhotoURL;

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      userID = response.authResponse.userID;
      accessToken = response.authResponse.accessToken;
      getPhoto();
    } else {
      $('#login-button').on('click', login).css("visibility", "visible");
    }
  });

  var login = function() {
    FB.login(function(response) {
      if (response.authReponse) {
        getPhoto();
        $('#login-button').on('click', login).css("visibility", "invisible");
      }
    });
  };

  var getPhoto = function() {
    FB.api('/'+userID+'/picture', {
      redirect: 'false',
      type: 'large',
      accessToken: accessToken
    }, function(response) {
      userPhotoURL = response.data.url;
      $('#photo-url').val(userPhotoURL);
    });
  };

  $('#photo-url').on('focus', function() {
    $('#photo-url').val('');
  });
});
