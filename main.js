var lan_ip;

window.electronAPI.getIP().then(function(result) {
    lan_ip = result;
});

function phoneLink() {
    console.log(lan_ip);
}
