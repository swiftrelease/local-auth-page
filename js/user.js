function User(username, name, email, pass) {
  var username = username;
  var name = name;
  var email = email;
  var pass = Sha256.hash(pass);
  var avatarUrl;
  var token = Sha256.hash(Math.random());

  this.setAvatarUrl = function(url) {
    avatarUrl = url;
  };

  this.getAvatarUrl = function() {
    return avatarUrl;
  };

  this.checkPassword = function(password) {
    return Sha256.hash(password) === pass;
  };

  this.usernameEquals = function(un) {
    return username.toLowerCase() === un.toLowerCase();
  };

  this.emailEquals = function(e) {
    return email.toLowerCase() === e.toLowerCase();
  };

  this.resetToken = function() {
    token = Sha256.hash(Math.random());
  };

  this.checkToken = function(t) {
    return token.toLowerCase() === t.toLowerCase();
  };

  this.show = function() {
    return this;
  }
}

var users = [];
