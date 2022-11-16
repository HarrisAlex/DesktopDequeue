var lan_ip;
var allActions;

var phoneLink = $("#phoneLink");
var phoneLinkClose = $("#phoneLinkClose");
var phoneLinkContainer = $("#phoneLinkContainer");
var newActionContainer = $("#newActionContainer");


// Submit button to save action
var saveActionButton = $("#saveAction");
var actionNameInput = $("#actionName");
var backgroundColorInput = $("#actionBackgroundColor");
var pickIconButton = $("#pickIcon");
var recordButton = $("#record");
var iconColorInput = $("#actionIconColor");

pickIconButton.on("click", openIconSelection);

actionNameInput.on("change", onActionInput);
backgroundColorInput.on("change", onActionInput);
iconColorInput.on("change", onActionInput);

// set save action to disabled and bind click event
saveActionButton.addClass("disabled");
saveActionButton.on("click", saveAction);


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
var iconSelectionContainer = $("#iconSelectionContainer");
var iconGrid = $("#iconGrid");
var selectedIcon;

//Icons
var icons = [
	"icons/dequeue.svg",
	"icons/gear.svg"
];

var iconSelectionInstance = [];

var gaysex = $("#gaysex");
gaysex.addClass("hidden");

closeIconSelection();

window.electronAPI.getIP().then(function (result) {
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
	newActionContainer.removeClass("firstLoad");
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

	let selectIcon = (iconSrc) => {
		selectedIcon = iconSrc;
		onActionInput();
		updateSelectedIcon();
		closeIconSelection();
	};

	iconSelectionInstance = [];

	iconGrid.empty();

	for (var i = 0; i < icons.length; i++) {
		var icon = $('<div class="icon"><img src=' + icons[i] + '></div>');
		icon.attr("iconsrc", icons[i]);
		icon.css("background-color", backgroundColorInput.val());

		iconSelectionInstance.push(icon);

		iconGrid
			.append(icon)
			.on("click", function () {});
	}
	
	for (var i = 0; i < iconSelectionInstance.length; i++) {
		let iconSrc = iconSelectionInstance[i].attr("iconsrc");
		iconSelectionInstance[i].on("click", () => selectIcon(iconSrc));
	}
}

function updateSelectedIcon() {
	pickIconButton.css({"background-image": "url(" + selectedIcon + ")", "background-size": "100% 100%", "background-color": backgroundColorInput.val()});
}

function closeIconSelection() {
	iconSelectionContainer.addClass("hidden");
	gaysex.addClass("hidden");
}

gaysex.on("click", function () {
	closeIconSelection();
});

$("#modalBackdrop").on("click", function () {
	closePhoneLink();
	closeNewActionContainer();
});

// for every text input, when focused give parent focused calss
$("input[type=text]").on("focus", function () {
	$(this).parent().addClass("focused");
});

// for every text input, when unfocused remove parent focused calss
$("input[type=text]").on("blur", function () {
	$(this).parent().removeClass("focused");
});

function setRandomDefaultValue(element) {
	// Give it a random value of either #19364D or #37718E
	var randomColor = Math.floor(Math.random() * 2) == 0 ? "#19364D" : "#37718E";
	element.val(randomColor);
}

$("input[type=color]").each(function () {
	setRandomDefaultValue($(this));
});

recordButton.on("click", function () {
	record();
});

function record() {
	isRecording = true;
	recordButton.addClass("recording");
	recordButton.html("Recording...");
}

// Keyboard event listeneer that listens for keypresses and prints the key pressed
document.addEventListener("keypress", function (e) {
	// console.log(e.key)

	var key = e.key;
	var modifierKeys = ["Shift", "Control", "Alt", "Meta"];
	e.getModifierState("Shift")
		? null
		: modifierKeys.splice(modifierKeys.indexOf("Shift"), 1);
	e.getModifierState("Alt")
		? null
		: modifierKeys.splice(modifierKeys.indexOf("Alt"), 1);
	e.getModifierState("Control")
		? null
		: modifierKeys.splice(modifierKeys.indexOf("Control"), 1);
	e.getModifierState("Meta")
		? null
		: modifierKeys.splice(modifierKeys.indexOf("Meta"), 1);
	console.log(modifierKeys);
	console.log(key);

	if (isRecording) {
		var keyContainer = recordButton;
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
		recordButton.removeClass("recording");
		hasBeenRecorded = true;
		onActionInput();
	}
});

// FRONTEND FACTORIES

// -- Icon Builder --
// Takes in an icon name and converts it to the appropriate icon
function iconBuilder(iconName) {
	var icon = $("<img>").addClass("actionIcon");

	// switch (iconName) {
	// 	case "gear":
	// 		icon.attr("src", "icons/gear.svg");
	// 		break;
	// 	default:
	// 	case "dequeue":
	// 		icon.attr("src", "icons/dequeue.svg");
	// 		break;
	// }

	icon.attr("src", iconName);

	return icon;
}

function onActionInput() {
	saveActionButton.addClass("disabled");

	if (actionNameInput.val() === '') return;
	if (backgroundColorInput.val() === '') return;
	if (iconColorInput.val() === '') return;
	if (selectedIcon === null) return;
	if (recordButton.html() === "Record") return;

	saveActionButton.removeClass("disabled");
}

function saveAction() {
	if (saveActionButton.hasClass("disabled")) return;

	window.electronAPI.getActions().then(function (result) {
		saveActionToJSON(result);
	});
}

function saveActionToJSON(existingActions) {
	var newAction = {
		"name": actionNameInput.val(),
		"icon": selectedIcon,
		"id": 	Math.floor(Math.random() * 100000000000000),
		"backgroundColor": backgroundColorInput.val(),
		"iconColor": iconColorInput.val(),
		"keybinds": recordButton.html()
	};

	existingActions.push(newAction);

	allActions = existingActions;

	window.electronAPI.setActions(existingActions);

	closeNewActionContainer();
	refreshActions();
}

//  -- Action builder --
//  Takes in actions in the format of:
//  {
//      name: "Action Name",
//      icon: "iconName",
//      id: "actionID",
//      backgroundColor: "#19364D",
//      iconColor: "#37718E",
//      keybinds: [["Shift", "Alt", "a"], ["Shift", "Alt", "b"]]
//  }

function actionBuilder(action) {
	var actionContainer = $("<div>").addClass("actionContainer");

	var icon = iconBuilder(action.icon);

	var actionName = $("<div>")
		.addClass("actionName")
		.text(action.name ? action.name : "Action Name");

	actionContainer.attr("data-keybinds", action.keybinds);
	actionContainer.attr("data-id", action.id);

	actionContainer.css("--background-color", action.backgroundColor);

	actionContainer.append(icon);
	actionContainer.append(actionName);

	return actionContainer;
}

function newActionButtonBuilder() {
	var newActionButton = $("<div>").attr("id", "newActionButton");
	newActionButton.text("+");

	newActionButton.on("click", openNewActionContainer);
	return newActionButton;
}

function fillActions(actions) {
	$("#actionsContainer").empty();
	for (var i = 0; i < actions.length; i++) {
		if (actions[i]) {
			$("#actionsContainer").append(actionBuilder(actions[i]));
		}
	}
	$("#actionsContainer").append(newActionButtonBuilder());
}

// COMMUNICATION WITH THE BACKEND
function getActions() {
	window.electronAPI.getActions().then(function (result) {
		fillActions(result);
	});
}

function refreshActions() {
	fillActions(allActions);
}

getActions();
