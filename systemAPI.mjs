console.info("------------------------------------\n---- CHAOS ERROR SOLUTIONS V1.0 ----\n------ COPYRIGHT OF CHAOS INC.------\n------------------------------------");
console.log("CES: Initialising...")

function showError(errorinput,errordesc,fatal) {
    if (fatal == true) {console.error("CES: A fatal error has occurred.");document.getElementById("errorSymbol").innerHTML="X"} else {console.warn("CES: An error has occurred.");document.getElementById("errorSymbol").innerHTML="!"};
    document.getElementById("errorBar").removeAttribute("style");
    document.getElementById("errorText").innerHTML = `${errorinput} \n ${errordesc}`
}

export { showError };

console.log("CES: Initialisation complete.")