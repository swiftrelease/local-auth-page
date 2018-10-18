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

  this.show = function() {
    return this;
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
      container.style.height = "";
      container.removeChild(registerContainer);
      container.appendChild(loginContainer);
    }
  } else if(this == tabRegister) {
    if(!document.getElementById("register-container")) {
      container.style.height = "400px";
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

var usernameWarningLabel = document.createElement("label");
var passWarningLabel = document.createElement("label");
//usernameWarningLabel.innerText = "User does not exist";
//passWarningLabel.innerText = "Incorrect password";
usernameWarningLabel.className = passWarningLabel.className = "warning";


registerNameWarningLabel = document.createElement("label");
registerEmailWarningLabel = document.createElement("label");
registerLoginWarningLabel = document.createElement("label");
registerPassWarningLabel = document.createElement("label");
registerNameWarningLabel.className = registerEmailWarningLabel.className = registerLoginWarningLabel.className =
  registerPassWarningLabel.className = "warning";

// Button click actions

// Register button click event handler
registerButton.onclick = function(event) {
  // Remove previous warnings
  var warnings = document.getElementsByClassName("warning");
  for(var el of warnings) {
    el.parentElement.removeChild(el);
  }

  if(!registerNameInp.value) {
    registerNameWarningLabel.innerText = "* Field required";
    registerNameWrapper.appendChild(registerNameWarningLabel);
    return;
  } else if(!registerEmailInp.value) {
    registerEmailWarningLabel.innerText = "* Field required";
    registerEmailWrapper.appendChild(registerEmailWarningLabel);
    return;
  } else if(!registerLoginInp.value) {
    registerLoginWarningLabel.innerText = "* Field required";
    registerLoginWrapper.appendChild(registerLoginWarningLabel);
    return;
  } else if(!registerPassInp.value) {
    registerPassWarningLabel.innerText = "* Field required";
    registerPassWrapper.appendChild(registerPassWarningLabel);
    return;
  }

  // Email validation
  var emailPattern = /[a-z0-9-.!#$%&'*+/=?^_`{|}~]+@[a-z0-9-.]+\.[a-z]+/i;
  if(registerEmailInp.value.match(emailPattern)[0] !== registerEmailInp.value) {
    registerEmailWarningLabel.innerText = "Invalid email address";
    registerEmailWrapper.appendChild(registerEmailWarningLabel);
    return;
  }

  // if(!registerLoginInp.value || !registerNameInp.value || !registerEmailInp.value || !registerPassInp.value) {
  //   console.log("One of the fields is empty");
  //   return;
  //

  for(var u of users) {
    if(u.usernameEquals(registerLoginInp.value)) {
      showWarningLabel(registerLoginWarningLabel, registerLoginWrapper, "Username already taken");
      // console.log("Username already taken");
      return;
    }
    if(u.emailEquals(registerEmailInp.value)) {
      showWarningLabel(registerEmailWarningLabel, registerEmailWrapper, "User with this email already exists");
      return;
    }
  }
  var user = new User(registerLoginInp.value, registerNameInp.value, registerEmailInp.value, registerPassInp.value);
  users.push(user);
};

// Login button click event handler
loginButton.onclick = function(event) {
  // Remove previous warnings
  var warnings = document.getElementsByClassName("warning");
  for(var el of warnings) {
    el.parentElement.removeChild(el);
  }

  // Check that both inputs are filled
  if(!loginInp.value) {
    usernameWarningLabel.innerText = "* Field required";
    loginWrapper.appendChild(usernameWarningLabel);
    return;
  } else if(!passInp.value) {
    passWarningLabel.innerText = "* Field required";
    passWrapper.appendChild(passWarningLabel);
    return;
  }

  // Reset warning labels text
  usernameWarningLabel.innerText = "User does not exist";
  passWarningLabel.innerText = "Incorrect password";
  for(var u of users) {
    if(u.usernameEquals(loginInp.value) || u.emailEquals(loginInp.value)) {
      u.checkPassword(passInp.value) ? console.log("Login successful") : passWrapper.appendChild(passWarningLabel);
      return;
    }
  }
  loginWrapper.appendChild(usernameWarningLabel);
};


// Append warning label to DOM with @text
function showWarningLabel(label, wrapper, text) {
  label.innerText = text;
  wrapper.appendChild(label);
}

//  Get the array of registered users
function getUsers() {
  return localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
}

// Add users to the localStorage
function addUser(user) {
    var users = getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

// Add elements to the page
function addElement(tag, container) {
  var cont = container ? container : document.body;
  var el = document.createElement(tag);
  cont.appendChild(el);
  return el;
}
