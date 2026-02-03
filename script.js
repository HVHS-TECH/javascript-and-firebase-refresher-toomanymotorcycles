var title = document.getElementById("welcomeMessage");
var errorBar = document.getElementById("errorBar");
title.innerHTML = "Javascript connected.";

function changebutton() {
    title.innerHTML = String(document.getElementById("changeinput").value);
    document.getElementById("header").innerHTML = String(document.getElementById("changeinput").value);
    document.getElementById("changeinput").value = "";
}

function showError(errorinput) {
    errorBar.setAttribute("hidden");
}