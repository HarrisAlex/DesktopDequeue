


var lan_ip;

var phoneLink = $("#phoneLink");
var phoneLinkClose = $("#phoneLinkClose");
var phoneLinkContainer = $("#phoneLinkContainer");
var newActionContainer = $("#newActionContainer");


// Submit button to save action
var saveAction = $("#saveAction");

// set save action to disabled
$("#saveAction").addClass("disabled");


$("#gaysex").addClass("hidden");

// Keeps track of if the user has recorded an action yet
let hasBeenRecorded = false;

// Keeps track of if currently recording
let isRecording = false;


phoneLink.on("click", openPhoneLink);

$("#addAction").on("click", openNewActionContainer);

phoneLinkClose.on("click", closePhoneLink);
phoneLinkContainer.addClass("hidden");
newActionContainer.addClass("hidden");
phoneLinkContainer.addClass("firstLoad");
newActionContainer.addClass("firstLoad");

var newActionContainer = $("#newActionContainer");

var modalBackdrop = $("#modalBackdrop");
modalBackdrop.addClass("hidden");


//Icon selection
var pickIconButton = $("#pickIcon");
pickIconButton.on("click", openIconSelection);

var iconSelectionContainer = $("#iconSelectionContainer");

var iconGrid = $("#iconGrid");

//Icons
var icons = ["placeholder.jpeg", "placeholder.jpeg", "backdrop.jpeg", "icon.jpeg", "placeholder.jpeg", "icon.jpeg", "placeholder.jpeg", "icon.jpeg"];

var gaysex = $("#gaysex");
gaysex.addClass("hidden");

closeIconSelection();

var selectedIcon;

window.electronAPI.getIP().then(function(result) {
    lan_ip = result;
});

function openPhoneLink() {
    phoneLinkContainer.removeClass("firstLoad");
    phoneLinkContainer.removeClass("hidden");
    modalBackdrop.removeClass("hidden");
    $("#ipAddress").html(lan_ip);

    phoneLink.addClass("hidden");
}

function closePhoneLink() {
    phoneLinkContainer.addClass("hidden");

    phoneLink.removeClass("hidden");
    modalBackdrop.addClass("hidden");
}

function openNewActionContainer() {
    phoneLinkContainer.removeClass("firstLoad");
    newActionContainer.removeClass("hidden");
    modalBackdrop.removeClass("hidden");
}

function closeNewActionContainer() {
    newActionContainer.addClass("hidden");
    modalBackdrop.addClass("hidden");
}

function openIconSelection() {

    iconSelectionContainer.removeClass("hidden");
    iconSelectionContainer.offset(pickIconButton.offset());

    $("#gaysex").removeClass("hidden");

    for (var i = 0; i < icons.length; i++) {
        iconGrid.append('<div class="icon"><img src=' + icons[i] + '></div>').on('click', function() {
            
        });
    }
}

function closeIconSelection() {
    iconSelectionContainer.addClass("hidden");
    gaysex.addClass("hidden");
}

gaysex.on("click", function() {
    closeIconSelection();
});

$("#modalBackdrop").on("click", function() {
    closePhoneLink();
    closeNewActionContainer();
});

// for every text input, when focused give parent focused calss
$("input[type=text]").on("focus", function() {
    $(this).parent().addClass("focused");
}
);

// for every text input, when unfocused remove parent focused calss
$("input[type=text]").on("blur", function() {
    $(this).parent().removeClass("focused");
}
);

openNewActionContainer();

function setRandomDefaultValue(element) {
    // Give it a random value of either #19364D or #37718E
    var randomColor = Math.floor(Math.random() * 2) == 0 ? "#19364D" : "#37718E";
    element.val(randomColor);
}

function verifyCanSubmitAction() {
    if (hasBeenRecorded) {
        $("#saveAction").removeClass("disabled");
    }
}






$("input[type=color]").each(function() {
    setRandomDefaultValue($(this));
});



$("#record").on("click", function() {
    record();
});

function record() {
    isRecording = true;
    $("#record").addClass("recording");
    $("#record").html("Recording...");
}




// Keyboard event listeneer that listens for keypresses and prints the key pressed
document.addEventListener("keypress", function(e) {
    // console.log(e.key)

    
    var key = e.key;
    var modifierKeys = ["Shift", "Control", "Alt", "Meta"];
    e.getModifierState("Shift") ? null : modifierKeys.splice(modifierKeys.indexOf("Shift"), 1);; 
    e.getModifierState("Alt") ? null : modifierKeys.splice(modifierKeys.indexOf("Alt"), 1);;
    e.getModifierState("Control") ? null : modifierKeys.splice(modifierKeys.indexOf("Control"), 1);;
    e.getModifierState("Meta") ? null : modifierKeys.splice(modifierKeys.indexOf("Meta"), 1);;
    console.log(modifierKeys);
    console.log(key)


    if(isRecording) {
        var keyContainer = $("#record");
        // Modifier keys into a string with a + between each
        var modifierKeysString = modifierKeys.join(" + ");
        // If there are no modifier keys, just print the key
        if (modifierKeys.length == 0) {
            keyContainer.html(key);
        } else {
            // If there are modifier keys, print them and the key
            keyContainer.html(modifierKeysString + " + " + key);
        }
        isRecording = false;
        $("#record").removeClass("recording");
        hasBeenRecorded = true;
        verifyCanSubmitAction();
    }
});