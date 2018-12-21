// TBD remove TEST_ADD_LINE comments
// <button class="test-add-line" type="button">Test add line (temp)</button>
// IE 11 and up support



// comment autobahn stuff
// exception handling

document.addEventListener("DOMContentLoaded", function (event) {
	
	var i;
	
	// websocket connection config
	const WEBSOCKET_SERVER_URL = 'ws://localhost:9090/';
	const WEBSOCKET_REALM_TO_CONNECT_TO = 'main_realm';
	const WEBSOCKET_TOPIC_TO_SUBSCRIBE_TO = "main";
	const WEBSOCKET_CLIENT_ROLE = "listener";
	const WEBSOCKET_CLIENT_SIGNATURE = "Cd5JwzGnNz8h1ui8Rl70DZp4TEOyJbzR";
	const WEBSOCKET_AUTH_METHODS = ['regular'];
	const WEBSOCKET_MAX_RETRIES = 0;
	
	// elements
	const CONNECTION_STATUS_ELEMENTS = document.querySelectorAll('#page .connection-status');
	const RECIEVED_ELEMENTS = document.querySelectorAll('#page .recieved');
	const CONNECT_BUTTON_ELEMENTS = document.querySelectorAll('#page .control-buttons .connect');
	const DISCONNECT_BUTTON_ELEMENTS = document.querySelectorAll('#page .control-buttons .disconnect');
	const CLEAR_TEXT_BUTTON_ELEMENTS = document.querySelectorAll('#page .control-buttons .clear-text');

	// strings
	const STATUS_DISCONNECTED = "Status: Disconnected.";
	const STATUS_CONNECTED = "Status: Connected.";
	const STATUS_LOST_CONNECTION = "Status: Disconnected. Lost connection with server";
	const STATUS_UNREACHABLE = "Status: Connection attempt failed. Server unreachable.";
	const NOTIFICATION_TEXT = "Event happened";

	// configure autobahn connection object
	var connection = new autobahn.Connection({
		url: WEBSOCKET_SERVER_URL,
		realm: WEBSOCKET_REALM_TO_CONNECT_TO,
		onchallenge: function (session, method, extra) {
			return {
				"signature": WEBSOCKET_CLIENT_SIGNATURE,
				"role": WEBSOCKET_CLIENT_ROLE,
			};
		},
		authmethods: WEBSOCKET_AUTH_METHODS,
		max_retries: WEBSOCKET_MAX_RETRIES,
	});
	connection.onopen = function (session) {

		// update connection status label on connect
		var i;
		for (i=0; i<CONNECTION_STATUS_ELEMENTS.length; i++) {
			CONNECTION_STATUS_ELEMENTS[i].innerHTML = STATUS_CONNECTED;
		}
		
		// define response to event
		session.subscribe(
			WEBSOCKET_TOPIC_TO_SUBSCRIBE_TO, 
			function (args) {

				var i;
				for (i=0; i<RECIEVED_ELEMENTS.length; i++) {

					var new_content = document.createElement(
						'div'
					);
					new_content.className = "message";
					new_content.innerHTML = NOTIFICATION_TEXT;

					RECIEVED_ELEMENTS[i].appendChild(new_content);
					
				}

			}
		)
		
		// enable disconnect button
		for (i=0; i<DISCONNECT_BUTTON_ELEMENTS.length; i++) {
			DISCONNECT_BUTTON_ELEMENTS[i].disabled = false;
		}
		
	};
	connection.onclose = function (reason, details) {

		var i;
	
		// update status label
		if (reason.valueOf() === "unreachable") {
			
			for (i=0; i<CONNECTION_STATUS_ELEMENTS.length; i++) {
			
				CONNECTION_STATUS_ELEMENTS[i].innerHTML = STATUS_UNREACHABLE;

			}
			
		} else if (reason.valueOf() === "lost" && (details.message === null || details.message === undefined)) {
			
			// update connection status label on disconnect
			for (i=0; i<CONNECTION_STATUS_ELEMENTS.length; i++) {
			
				CONNECTION_STATUS_ELEMENTS[i].innerHTML = STATUS_LOST_CONNECTION;

			}
			
		} else if (reason.valueOf() === "lost" && details.reason.valueOf() === "wamp.error.goodbye_and_out") {

			// update connection status label on disconnect
			for (i=0; i<CONNECTION_STATUS_ELEMENTS.length; i++) {
			
				CONNECTION_STATUS_ELEMENTS[i].innerHTML = STATUS_DISCONNECTED;

			}
			
		}

		// disable disconnect button
		for (i=0; i<DISCONNECT_BUTTON_ELEMENTS.length; i++) {
			DISCONNECT_BUTTON_ELEMENTS[i].disabled = true;
		}
		
		// enable connect button
		for (i=0; i<CONNECT_BUTTON_ELEMENTS.length; i++) {
			CONNECT_BUTTON_ELEMENTS[i].disabled = false;
		}

	}

	// display initial connection status
	for (i=0; i<CONNECTION_STATUS_ELEMENTS.length; i++) {
		CONNECTION_STATUS_ELEMENTS[i].innerHTML = STATUS_DISCONNECTED;
	}
	
	// initially disable disconnect button
	for (i=0; i<DISCONNECT_BUTTON_ELEMENTS.length; i++) {
		DISCONNECT_BUTTON_ELEMENTS[i].disabled = true;
	}

	// attach button event listeners
	for (i=0; i<CONNECT_BUTTON_ELEMENTS.length; i++) {
		CONNECT_BUTTON_ELEMENTS[i].addEventListener("click", function () {
			
			// disable connect button
			for (i=0; i<CONNECT_BUTTON_ELEMENTS.length; i++) {
				CONNECT_BUTTON_ELEMENTS[i].disabled = true;
			}
			
			// if connection attempt fails, enable connect button
			try {
				connection.open();
			} catch (err) {

				for (i=0; i<CONNECT_BUTTON_ELEMENTS.length; i++) {
					CONNECT_BUTTON_ELEMENTS[i].disabled = false;
				}
				
			}
			
		});
	}
	for (i=0; i<DISCONNECT_BUTTON_ELEMENTS.length; i++) {
		DISCONNECT_BUTTON_ELEMENTS[i].addEventListener("click", function () {
			
			// disable disconnect button
			for (i=0; i<DISCONNECT_BUTTON_ELEMENTS.length; i++) {
				DISCONNECT_BUTTON_ELEMENTS[i].disabled = true;
			}
			
			// if disconnect attempt fails, enable disconnect button
			try {
				connection.close();
			} catch (err) {
				
				for (i=0; i<DISCONNECT_BUTTON_ELEMENTS.length; i++) {
					DISCONNECT_BUTTON_ELEMENTS[i].disabled = false;
				}
				
			}
			
		});
		
	}
	for (i=0; i<CLEAR_TEXT_BUTTON_ELEMENTS.length; i++) {
		CLEAR_TEXT_BUTTON_ELEMENTS[i].addEventListener("click", function () {
			
			var i
			for (i=0; i<RECIEVED_ELEMENTS.length; i++) {
		
				RECIEVED_ELEMENTS[i].innerHTML = "";

			}
			
		});
	}

});