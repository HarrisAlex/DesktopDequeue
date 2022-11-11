var lan_ip;

$("#phone-link").on("click", phoneLink);

window.electronAPI.getIP().then(function(result) {
    lan_ip = result;
});

function phoneLink() {
    console.log(lan_ip);
}
