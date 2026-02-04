var title = document.getElementById("welcomeMessage");
title.innerHTML = "Javascript connected.";

function changebutton() {
    title.innerHTML = String(document.getElementById("changeinput").value);
    document.getElementById("header").innerHTML = String(document.getElementById("changeinput").value);
    document.getElementById("changeinput").value = "";
}