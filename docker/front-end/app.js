const input = document.getElementById('input-field');

const url = "https://localhost:1884";

//random client ID aanmaken
const clientId = 'user-' + Math.random().toString(16).substr(2, 4);

var select_input = document.getElementById('input-field');
select_input.select();

const options = {
	clean: true,
	connectTimeout: 4000,
	clientId: clientId,
}

//mqtt client aanmaken
const client = mqtt.connect(url, options);

//eventhandler voor wanneer client verbinding maakt met broker
client.on("connect", () => {
	console.log('Connected');
	client.subscribe("messages", (err) => {
	  	if (err) {
			console.log("Error: ", err);
	  	}
	});
});

//eventhandler voor wanneer berichten worden ontvangen
client.on('message', function (topic, message) {
	var otherClientId = message.toString().substring(0, 9)
	var receivedMessage = message.toString().substring(9)
	if (otherClientId != clientId) {
		appendMessage(otherClientId, receivedMessage);
	}
});

//eventlistener voor enter knop indrukken
document.getElementById('input-field').addEventListener('keydown', function(event) {
	if (event.key == 'Enter') {
		event.preventDefault();
		send();
	}
});

//eventlistener voor klikken op send knop
document.getElementById('send-button').addEventListener('click', send)	

//bericht versturen
function send() {
    if (input.value) {
        const messageText = input.value;
        appendMessage(clientId, messageText);
        client.publish('messages', clientId + messageText);
        input.value = '';
    }
}

//functie om berichten aan UI toe te voegen
function appendMessage(clientId, messageText) {
    const messageContainer = document.createElement('li');
    messageContainer.classList.add('message-container');

    const clientIdElement = document.createElement('div');
    clientIdElement.classList.add('client-id');
    clientIdElement.textContent = clientId;
    
    const messageTextElement = document.createElement('div');
    messageTextElement.classList.add('message-text');
    messageTextElement.textContent = messageText;

    messageContainer.appendChild(clientIdElement);
    messageContainer.appendChild(messageTextElement);
    
    messages.appendChild(messageContainer);
}