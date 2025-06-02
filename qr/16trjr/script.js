if (localStorage.getItem("final") === "yes") {
    document.title = "All at Once";
    document.getElementById('overlay').style.display = "flex";
} else {
    window.location.replace("/401.html");
}