var userID, accessToken, userPhotoURL;
window.fbAsyncInit = function() {
  FB.init({
    appId: '285589698272181',
    status: true,
    xfbml: true
  });

  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
      userID = response.authResponse.userID;
      accessToken = response.authResponse.accessToken;
      $('#login-button').off('click')
                        .on('click', getPhoto);
      getPhoto();
    } else if (response.status === 'not_authorized') {
    } else {
    }
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "http://connect.facebook.net/en_US/all.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var login = function() {
  FB.login(function(response) {
    if (response.authReponse) {
      getPhoto();
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

$('#login-button').one('click', login);
$('#photo-url').on('focus', function() {
  $('#photo-url').val('');
});