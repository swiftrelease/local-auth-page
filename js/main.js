var loginHtmlDataUrl = "https://js.4minutewarning.net/auth/assets/login-html-data.json";
var loginDom = {};
buildPage();


var token;
for(var c of document.cookie.split(";")) {
  if(c.split("=")[0].indexOf("token") === 0)
    token = c.split("=")[1];
}

var currentUser;

if(token) {
  for(var user of users) {
    if(user.checkToken(token)) {
      console.log("Logging in due to cookie");
      currentUser = user;
      showProfilePage();
    }
  }
}

/*
var container = addElement("div", document.body, true, "container");

var tabContainer = addElement("ul", container, true, "tab-container");

var tabLogin = addElement("li", tabContainer, true, "tab selected", "Log in");
var tabRegister = addElement("li", tabContainer, true, "tab", "Register");

*/
var tabs = [loginDom.tabLogin, loginDom.tabRegister];


selectTab = function(event) {
  this.className = "tab selected";
  for(var tab of tabs) {
    if(tab != this) {
      tab.className = "tab";
    }
  }
  if(this == tabLogin) {
    if(!document.getElementById("login-container")) {
      loginDom.container.style.height = "";
      loginDom.container.removeChild(loginDom.registerContainer);
      loginDom.container.appendChild(loginDom.loginContainer);
    }
  } else if(this == tabRegister) {
    if(!document.getElementById("register-container")) {
      loginDom.container.style.height = "400px";
      loginDom.container.removeChild(loginDom.loginContainer);
      loginDom.container.appendChild(loginDom.registerContainer);
    }
  }
}


loginDom.tabLogin.onclick = loginDom.tabRegister.onclick = selectTab;

/*
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

*/

// Button click actions

// Register button click event handler
loginDom.registerButton.onclick = function(event) {
  // Remove previous warnings
  var warnings = document.getElementsByClassName("warning");
  for(var el of warnings) {
    el.parentElement.removeChild(el);
  }

  if(!loginDom.registerNameInp.value) {
    loginDom.registerNameWarningLabel.innerText = "* Field required";
    loginDom.registerNameWrapper.appendChild(loginDom.registerNameWarningLabel);
    return;
  } else if(!loginDom.registerEmailInp.value) {
    loginDom.registerEmailWarningLabel.innerText = "* Field required";
    loginDom.registerEmailWrapper.appendChild(loginDom.registerEmailWarningLabel);
    return;
  } else if(!loginDom.registerLoginInp.value) {
    loginDom.registerLoginWarningLabel.innerText = "* Field required";
    loginDom.registerLoginWrapper.appendChild(loginDom.registerLoginWarningLabel);
    return;
  } else if(!loginDom.registerPassInp.value) {
    loginDom.registerPassWarningLabel.innerText = "* Field required";
    loginDom.registerPassWrapper.appendChild(loginDom.registerPassWarningLabel);
    return;
  }

  // Email validation
  var emailPattern = /[a-z0-9-.!#$%&'*+/=?^_`{|}~]+@[a-z0-9-.]+\.[a-z]+/i;
  if(!loginDom.registerEmailInp.value.match(emailPattern) ||
      loginDom.registerEmailInp.value.match(emailPattern)[0] !== loginDom.registerEmailInp.value) {
    loginDom.registerEmailWarningLabel.innerText = "Invalid email address";
    loginDom.registerEmailWrapper.appendChild(loginDom.registerEmailWarningLabel);
    return;
  }

  for(var u of users) {
    if(u.usernameEquals(loginDom.registerLoginInp.value)) {
      showWarningLabel(loginDom.registerLoginWarningLabel, loginDom.registerLoginWrapper, "Username already taken");
      return;
    }
    if(u.emailEquals(loginDom.registerEmailInp.value)) {
      showWarningLabel(loginDom.registerEmailWarningLabel, loginDom.registerEmailWrapper, "User with this email already exists");
      return;
    }
  }

  var user = new User(loginDom.registerLoginInp.value, loginDom.registerNameInp.value,
    loginDom.registerEmailInp.value, loginDom.registerPassInp.value);
  users.push(user);
  user.saveToStorage();
  currentUser = user;
};

// Login button click event handler
loginDom.loginButton.onclick = function(event) {
  // Remove previous warnings
  var warnings = document.getElementsByClassName("warning");
  for(var el of warnings) {
    el.parentElement.removeChild(el);
  }

  // Show warnings if an input is empty
  if(!loginDom.loginInp.value) {
    loginDom.usernameWarningLabel.innerText = "* Field required";
    loginDom.loginWrapper.appendChild(loginDom.usernameWarningLabel);
    return;
  } else if(!loginDom.passInp.value) {
    loginDom.passWarningLabel.innerText = "* Field required";
    loginDom.passWrapper.appendChild(loginDom.passWarningLabel);
    return;
  }

  // Reset warning labels text
  loginDom.usernameWarningLabel.innerText = "User does not exist";
  loginDom.passWarningLabel.innerText = "Incorrect password";
  for(var u of users) {
    if(u.usernameEquals(loginDom.loginInp.value) || u.emailEquals(loginDom.loginInp.value)) {
      if(u.checkPassword(loginDom.passInp.value)) {
        console.log("Login successful");
        currentUser = u;
        u.setLoginCookie();
        showProfilePage();
        return;
      } else {
        loginDom.passWrapper.appendChild(loginDom.passWarningLabel);
        return;
      }
    }
  }
  loginDom.loginWrapper.appendChild(loginDom.usernameWarningLabel);
};


// Append warning label to DOM with @text
function showWarningLabel(label, wrapper, text) {
  label.innerText = text;
  wrapper.appendChild(label);
}

// Add elements to the page
function addElement(tag, container, append, classname, innertext) {
  var cont = container ? container : document.body;
  var el = document.createElement(tag);
  el.className = classname ? classname : "";
  el.innerText = innertext ? innertext : "";
  if(append) {
    cont.appendChild(el);
  }
  return el;
}

function getJsonData(url) {
  return fetch(url).then(response => response.json());
}

async function buildPage() {
  await getJsonData(loginHtmlDataUrl)
    .then(data => {
      data.forEach(item => {
        var container = item.parent === "document.body" ?
          document.body : loginDom[item.parent];
        loginDom[item.name] = addElement(item.tag, container, item.append,
          item.className, item.innerText ? item.innerText : "");
        if(item.type) loginDom[item.name].type = item.type;
        if(item.id) loginDom[item.name].id = item.id;
      });
    }).catch(error => console.log(error));
}

/*
async function buildPage(url) {
  var response = await fetch(url);
  var data = await response.json();
  data.forEach(item => {
    var container = item.parent === "document.body" ?
      document.body : loginDom[item.parent];
    loginDom[item.name] = addElement(item.tag, container, item.append,
      item.className, item.innerText ? item.innerText : "");
    if(item.type) loginDom[item.name].type = item.type;
    if(item.id) loginDom[item.name].id = item.id;
  });
}
*/
