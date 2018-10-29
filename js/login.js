var loginHtmlDataUrl = "https://js.4minutewarning.net/auth/assets/login-html-data.json";
var loginDom = {};

function buildLoginPage() {
  var tabs = [loginDom.tabLogin, loginDom.tabRegister];

  selectTab = function(event) {
    this.className = "tab selected";
    for(var tab of tabs) {
      if(tab != this) {
        tab.className = "tab";
      }
    }
    if(this == loginDom.tabLogin) {
      if(!document.getElementById("login-container")) {
        loginDom.container.style.height = "";
        loginDom.container.removeChild(loginDom.registerContainer);
        loginDom.container.appendChild(loginDom.loginContainer);
      }
    } else if(this == loginDom.tabRegister) {
      if(!document.getElementById("register-container")) {
        loginDom.container.style.height = "400px";
        loginDom.container.removeChild(loginDom.loginContainer);
        loginDom.container.appendChild(loginDom.registerContainer);
      }
    }
  }

  loginDom.tabLogin.onclick = loginDom.tabRegister.onclick = selectTab;

  // Button click actions

  // Register button click event handler
  loginDom.registerButton.onclick = function(event) {
    // Remove previous warnings
    var warnings = document.getElementsByClassName("warning");
    for(var el of warnings) {
      el.parentElement.removeChild(el);
    }

    if(!loginDom.registerNameInp.value) {
      showWarningLabel(loginDom.registerNameWarningLabel, loginDom.registerNameWrapper, "* Field required");
      return;
    } else if(!loginDom.registerEmailInp.value) {
      showWarningLabel(loginDom.registerEmailWarningLabel, loginDom.registerEmailWrapper, "* Field required");
      return;
    } else if(!loginDom.registerLoginInp.value) {
      showWarningLabel(loginDom.registerLoginWarningLabel, loginDom.registerLoginWrapper, "* Field required");
      return;
    } else if(!loginDom.registerPassInp.value) {
      showWarningLabel(loginDom.registerPassWarningLabel, loginDom.registerPassWrapper, "* Field required");
      return;
    }

    // Email validation
    var emailPattern = /[a-z0-9-.!#$%&'*+/=?^_`{|}~]+@[a-z0-9-.]+\.[a-z]+/i;
    if(!loginDom.registerEmailInp.value.match(emailPattern) ||
        loginDom.registerEmailInp.value.match(emailPattern)[0] !== loginDom.registerEmailInp.value) {
      showWarningLabel(loginDom.registerEmailWarningLabel, loginDom.registerEmailWrapper, "Invalid email address");
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
}
