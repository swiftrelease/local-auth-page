function showProfilePage() {
  var loginCont = document.querySelector("div.container");
  if(loginCont) {
    loginCont.parentElement.removeChild(loginCont);
  }

  var profilePageContainer = addElement("div", document.body, true);

  var logoutButton = addElement("button", profilePageContainer, true, "button logout", "Log out");
  logoutButton.onclick = function(event) {
    document.body.removeChild(profilePageContainer);
    document.body.appendChild(container);
  };

  var greetingPar = addElement("p", profilePageContainer, true);
  greetingPar.innerHTML = `Hello there, <b>${currentUser.getUsername()}</b>`;
  addElement("br", profilePageContainer, true);

  var avatarWrapper = addElement("div", profilePageContainer, true);

  var avatar = addElement("img", avatarWrapper, true, "avatar");
  avatar.src = currentUser.getAvatarUrl();

  avatar.onclick = function(event) {
    var avatarUrlInput = addElement("input", avatarWrapper, true);
    var updateButton = addElement("button", avatarWrapper, true, "button", "Update");

    var uploadImageButton = addElement("input", avatarWrapper, true);
    uploadImageButton.type = "file";

    updateButton.onclick = function(event) {
      currentUser.setAvatarUrl(avatarUrlInput.value ? avatarUrlInput.value : currentUser.getAvatarUrl());
      currentUser.updateStorage();
      avatar.src = currentUser.getAvatarUrl();
      avatarWrapper.removeChild(avatarUrlInput);
      avatarWrapper.removeChild(updateButton);
      avatarWrapper.removeChild(uploadImageButton);
    };

    uploadImageButton.onchange = function(event) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onload = function(event) {
        var dataURL = event.target.result;
        currentUser.setAvatarUrl(dataURL);
        currentUser.updateStorage();
        avatar.src = currentUser.getAvatarUrl();
        avatarWrapper.removeChild(avatarUrlInput);
        avatarWrapper.removeChild(updateButton);
        avatarWrapper.removeChild(uploadImageButton);
      };
    };

  };

  var userInfoList = addElement("ul", profilePageContainer, true);
  var infoName = addElement("li", userInfoList, true, "", `Name: ${currentUser.getName()}`);
  var infoEmail = addElement("li", userInfoList, true, "", `Email: ${currentUser.getEmail()}`);

  var changeNameButton = addElement("button", infoName, true, "button", "Change");
  var changeEmailButton = addElement("button", infoEmail, true, "button", "Change");

  changeNameButton.onclick = function(event) {
    this.parentElement.removeChild(this);
    var newNameInp = addElement("input", infoName, true, "creds");
    newNameInp.placeholder = `${currentUser.getName()}`;
    var updateButton = addElement("button", infoName, true, "button", "Update");
    updateButton.onclick = function(event) {
      currentUser.setName(newNameInp.value ? newNameInp.value : currentUser.getName());
      currentUser.updateStorage();
      // this.parentElement.removeChild(this);
      // newNameInp.parentElement.removeChild(newNameInp);
      infoName.innerText = `Name: ${currentUser.getName()}`;
      infoName.appendChild(changeNameButton);
    };
  };

  changeEmailButton.onclick = function(event) {
    this.parentElement.removeChild(this);
    var newEmailInp = addElement("input", infoEmail, true, "creds");
    newEmailInp.placeholder = `${currentUser.getEmail()}`;
    var updateButton = addElement("button", infoEmail, true, "button", "Update");
    updateButton.onclick = function(event) {
      currentUser.setEmail(newEmailInp.value ? newEmailInp.value : currentUser.getEmail());
      currentUser.updateStorage();
      infoEmail.innerText = `Email: ${currentUser.getEmail()}`;
      infoEmail.appendChild(changeEmailButton);
    };
  };

}
