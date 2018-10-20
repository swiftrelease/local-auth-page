var token;
for(var c of document.cookie.split(";")) {
  if(c.split("=")[0].indexOf("token") === 0)
    token = c.split("=")[1];
}

if(token) {
  for(var user of users) {
    user.checkToken(token) ? console.log("Logging in due to cookie") : console.log("No cookie");
  }
}

var container = addElement("div", document.body, true, "container");

var tabContainer = addElement("ul", container, true, "tab-container");

var tabLogin = addElement("li", tabContainer, true, "tab selected", "Log in");
var tabRegister = addElement("li", tabContainer, true, "tab", "Register");

var tabs = [tabLogin, tabRegister];


tabContainer.selectTab = function(event) {
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
}

tabLogin.onclick = tabRegister.onclick = tabContainer.selectTab;

var loginContainer = addElement("div", container, true);
var registerContainer = document.createElement("div");
loginContainer.id = "login-container";
registerContainer.id = "register-container";

var loginWrapper = addElement("div", loginContainer, true, "input-wrapper login");
var passWrapper = addElement("div", loginContainer, true, "input-wrapper login");
var loginButtonWrapper = addElement("div", loginContainer, true, "input-wrapper login");

var loginLabel = addElement("label", loginWrapper, true, "", "Username or email");
var loginInp = addElement("input", loginWrapper, true, "creds");
var passLabel = addElement("label", passWrapper, true, "", "Password");
var passInp = addElement("input", passWrapper, true, "creds");
loginInp.type = "text";
passInp.type = "password";

var loginButton = addElement("button", loginButtonWrapper, true, "button", "Log in");
loginButton.type = "button";


// Define wrapper elements for Register tab content
var registerNameWrapper = addElement("div", registerContainer, true, "input-wrapper register");
var registerEmailWrapper = addElement("div", registerContainer, true, "input-wrapper register");
var registerLoginWrapper = addElement("div", registerContainer, true, "input-wrapper register");
var registerPassWrapper = addElement("div", registerContainer, true, "input-wrapper register");
var registerButtonWrapper = addElement("div", registerContainer, true, "input-wrapper register");

// Define Register tab input, label, button elements
var registerNameLabel = addElement("label", registerNameWrapper, true, "", "Full name");
var registerNameInp = addElement("input", registerNameWrapper, true, "creds");
var registerEmailLabel = addElement("label", registerEmailWrapper, true, "", "Email");
var registerEmailInp = addElement("input", registerEmailWrapper, true, "creds");
var registerLoginLabel = addElement("label", registerLoginWrapper, true, "", "Username");
var registerLoginInp = addElement("input", registerLoginWrapper, true, "creds");
var registerPassLabel = addElement("label", registerPassWrapper, true, "", "Password");
var registerPassInp = addElement("input", registerPassWrapper, true, "creds");

registerNameInp.type = registerEmailInp.type = registerLoginInp.type = "text";
registerPassInp.type = "password";

var registerButton = addElement("button", registerButtonWrapper, true, "button", "Register");
registerButton.type = "button";

var usernameWarningLabel = addElement("label", null, false, "warning");
var passWarningLabel = addElement("label", null, false, "warning");

registerNameWarningLabel = addElement("label", null, false, "warning");
registerEmailWarningLabel = addElement("label", null, false, "warning");
registerLoginWarningLabel = addElement("label", null, false, "warning");
registerPassWarningLabel = addElement("label", null, false, "warning");

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
  if(!registerEmailInp.value.match(emailPattern) ||
      registerEmailInp.value.match(emailPattern)[0] !== registerEmailInp.value) {
    registerEmailWarningLabel.innerText = "Invalid email address";
    registerEmailWrapper.appendChild(registerEmailWarningLabel);
    return;
  }

  for(var u of users) {
    if(u.usernameEquals(registerLoginInp.value)) {
      showWarningLabel(registerLoginWarningLabel, registerLoginWrapper, "Username already taken");
      return;
    }
    if(u.emailEquals(registerEmailInp.value)) {
      showWarningLabel(registerEmailWarningLabel, registerEmailWrapper, "User with this email already exists");
      return;
    }
  }

  var user = new User(registerLoginInp.value, registerNameInp.value, registerEmailInp.value, registerPassInp.value);
  users.push(user);
  user.saveToStorage();
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
      if(u.checkPassword(passInp.value)) {
        console.log("Login successful");
        u.setLoginCookie();
        return;
      } else {
        passWrapper.appendChild(passWarningLabel);
        return;
      }
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
function addElement(tag, container, append, classname, innertext) {
  var cont = container ? container : document.body;
  var el = document.createElement(tag);
  el.className = classname ? classname : "";
  el.innerText = innertext ? innertext : "";
  if(append) cont.appendChild(el);
  return el;
}
