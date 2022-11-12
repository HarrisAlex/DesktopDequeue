var static = require("node-static");
const fs = require("fs");
var file = new static.Server(`${__dirname}/public`);

require("http")
	.createServer(function (request, response) {
		if (request.url === "/getActions") {
			// set response header
			response.writeHead(200, { "Content-Type": "application/json" });
			// set response content
			// Get actions from actions.json and send it to the client
			response.write(JSON.stringify(getActions()));
			response.end();
		}
		if (request.url === "/addAction") {
			// set response header
			response.writeHead(200, { "Content-Type": "application/json" });
			// set response content
			// Get actions from actions.json and send it to the client
			var body = "";
			request.on("data", function (data) {
				body += data;
			});
			request.on("end", function () {
				var POST = JSON.parse(body);
				console.log("ADDING ACTION: " + POST);
				if (POST) {
					addAction(POST);
					response.write(JSON.stringify(getActions()));
					response.end();
				} else {
					response.write("No action was sent");
					response.end();
				}
			});
		}
		if (request.url == "runAction") {
			var body = "";
			request.on("data", function (data) {
				body += data;
			});
			request.on("end", function () {
				var actionID = JSON.parse(body);
				var actions = getActions();
				var action = actions.find((action) => action.uid == actionID);
				if (action) {
					console.log("RUNNING ACTION: " + action);
					runAction(action);
					response.write(JSON.stringify(getActions()));
					response.end();
				} else {
					response.write("No action was found");
					response.end();
					console.log("Action not found");
				}
			});
		}
	})
	.listen(2001);

function getActions() {
	var actions = require("./actions.json");
	return actions;
}

function addAction(action) {
	var actions = getActions();
	// adds a randomly generated unique id to the action
	action.uid = Math.floor(Math.random() * 100000000000000);
	actions.push(action);
	fs.writeFileSync("./actions.json", JSON.stringify(actions));
}
