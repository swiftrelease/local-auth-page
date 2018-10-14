function User(username, name, email, pass) {
  var username = username;
  var name = name;
  var email = email;
  var pass = Sha256.hash(pass);
  var avatarUrl;

  this.setAvatarUrl = function(url) {
    avatarUrl = url;
  };

  this.getAvatarUrl = function() {
    return avatarUrl;
  }

  this.checkPassword = function(password) {
    return Sha256.hash(password) === pass;
  };
  this.usernameEquals = function(un) {
    return username.toLowerCase() === un.toLowerCase();
  }
  this.emailEquals = function(e) {
    return email.toLowerCase() === e.toLowerCase();
  }
}

var users = [];

var container = addElement("div");
container.className = "container";

var tabContainer = addElement("ul", container);
tabContainer.className = "tab-container";

var tabLogin = addElement("li", tabContainer);
var tabRegister = addElement("li", tabContainer);
tabLogin.className = tabRegister.className = "tab";
tabLogin.className += " selected";
tabLogin.innerText = "Log in";
tabRegister.innerText = "Register";
var tabs = [tabLogin, tabRegister];


function selectTab(event) {
  this.className = "tab selected";
  for(var tab of tabs) {
    if(tab != this) {
      tab.className = "tab";
    }
  }
  if(this == tabLogin) {
    if(!document.getElementById("login-container")) {
      container.removeChild(registerContainer);
      container.appendChild(loginContainer);
    }
  } else {
    if(!document.getElementById("register-container")) {
      container.removeChild(loginContainer);
      container.appendChild(registerContainer);
    }
  }
  // loginContainer.style.display = (this == tabLogin) ? "" : "none";
  // registerContainer.style.display = (this == tabRegister) ? "" : "none";
}

tabLogin.onclick = tabRegister.onclick = selectTab;

var loginContainer = addElement("div", container);
var registerContainer = document.createElement("div");
loginContainer.id = "login-container";
registerContainer.id = "register-container";
//var registerContainer = addElement("div", container);
// registerContainer.style.display = "none";

var loginWrapper = addElement("div", loginContainer);
var passWrapper = addElement("div", loginContainer);
var loginButtonWrapper = addElement("div", loginContainer);
loginWrapper.className = passWrapper.className =
  loginButtonWrapper.className = "input-wrapper login";

var loginLabel = addElement("label", loginWrapper);
var loginInp = addElement("input", loginWrapper);
var passLabel = addElement("label", passWrapper);
var passInp = addElement("input", passWrapper);
loginInp.type = "text";
loginLabel.innerText = "Username or email";
passLabel.innerText = "Password";
passInp.type = "password";
loginInp.className = passInp.className = "creds";

var loginButton = addElement("button", loginButtonWrapper);
loginButton.className = "button";
loginButton.type = "button";
loginButton.innerText = "Log in";


// Define wrapper elements for Register tab content
var registerNameWrapper = addElement("div", registerContainer);
var registerEmailWrapper = addElement("div", registerContainer);
var registerLoginWrapper = addElement("div", registerContainer);
var registerPassWrapper = addElement("div", registerContainer);
var registerButtonWrapper = addElement("div", registerContainer);
registerNameWrapper.className = registerEmailWrapper.className =
  registerLoginWrapper.className = registerPassWrapper.className =
  registerButtonWrapper.className = "input-wrapper register";

// Define Register tab input, label, button elements
var registerNameLabel = addElement("label", registerNameWrapper);
var registerNameInp = addElement("input", registerNameWrapper);
var registerEmailLabel = addElement("label", registerEmailWrapper);
var registerEmailInp = addElement("input", registerEmailWrapper);
var registerLoginLabel = addElement("label", registerLoginWrapper);
var registerLoginInp = addElement("input", registerLoginWrapper);
var registerPassLabel = addElement("label", registerPassWrapper);
var registerPassInp = addElement("input", registerPassWrapper);
registerNameLabel.innerText = "Full name";
registerEmailLabel.innerText = "Email";
registerLoginLabel.innerText = "Username";
registerPassLabel.innerText = "Password";
registerNameInp.type = registerEmailInp.type = registerLoginInp.type = "text";
registerPassInp.type = "password";
registerNameInp.className = registerEmailInp.className =
  registerLoginInp.className = registerPassInp.className = "creds";

var registerButton = addElement("button", registerButtonWrapper);
registerButton.className = "button";
registerButton.type = "button";
registerButton.innerText = "Register";


// Button click actions

// Register button click event handler
registerButton.onclick = function(event) {
  if(!registerLoginInp.value || !registerNameInp.value || !registerEmailInp.value || !registerPassInp.value) {
    console.log("One of the fields is empty");
    return;
  }
  for(var u of users) {
    if(u.usernameEquals(registerLoginInp.value)) {
      console.log("Username already taken");
      return;
    }
  }
  var user = new User(registerLoginInp.value, registerNameInp.value, registerEmailInp.value, registerPassInp.value);
  users.push(user);
};

// Login button click event handler
loginButton.onclick = function(event) {
  if(!loginInp.value || !passInp.value) {
    console.log("One of the fields is empty");
    return;
  }
  for(var u of users) {
    if(u.usernameEquals(loginInp.value) || u.emailEquals(loginInp.value)) {
      u.checkPassword(passInp.value) ? console.log("Login successful") : console.log("Incorrect password");
      return;
    }
  }
  console.log("No such user registered");
};


// Function to add elements to the page
function addElement(tag, container) {
  var cont = container ? container : document.body;
  var el = document.createElement(tag);
  cont.appendChild(el);
  return el;
}
