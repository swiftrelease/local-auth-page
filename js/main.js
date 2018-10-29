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

getJsonData(loginHtmlDataUrl);

function showWarningLabel(label, wrapper, text) {
  label.innerText = text;
  wrapper.appendChild(label);
}

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

async function getJsonData(url) {
  var resp = await fetch(url);
  var data = await resp.json();
  data.forEach(item => {
    var container = item.parent === "document.body" ?
      document.body : loginDom[item.parent];
    loginDom[item.name] = addElement(item.tag, container, item.append,
      item.className, item.innerText ? item.innerText : "");
    if(item.type) loginDom[item.name].type = item.type;
    if(item.id) loginDom[item.name].id = item.id;
  });
  buildLoginPage();
}
