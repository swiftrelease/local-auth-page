function User(username, name, email, pass, passIsHashed, token) {
  var username = username;
  var name = name;
  var email = email;
  var pass = passIsHashed ? pass : Sha256.hash(pass);
  var avatarUrl;
  var token = token ? token : Sha256.hash(Math.random());

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

  this.setLoginCookie = function() {
    document.cookie = `token=${token};`;
    console.log(document.cookie);
  };

  this.resetToken = function() {
    token = Sha256.hash(Math.random());
  };

  this.checkToken = function(t) {
    return token.toLowerCase() === t.toLowerCase();
  };

  this.saveToStorage = function() {
    userData.push({
      username: username,
      name: name,
      email: email,
      passHash: pass,
      avatarUrl: avatarUrl,
      token: token
    });
    localStorage.setItem("users", JSON.stringify(userData));
  };
}

var users = [];

var userData = localStorage.getItem("users") ?
  JSON.parse(localStorage.getItem("users")) : [];

for(var entry of userData) {
  var u = new User(entry.username, entry.name, entry.email, entry.passHash, true, entry.token);
  u.setAvatarUrl(entry.avatarUrl);
  users.push(u);
}
