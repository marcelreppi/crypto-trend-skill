const Alexa = require('alexa-sdk');
const https = require('https')

const handlers = {
	'LaunchRequest': function () {
		this.emit('GetTrendVolumeIntent');
	},
	'GetTrendVolumeIntent': function () {
		https.get('https://api.coinmarketcap.com/v1/ticker/?limit=0', (response) => {
		  
		  let res = ''
		  response.on('data', (data) => {
			res += data.toString()
		  })
		  
		  response.on('end', () => {
			const data = JSON.parse(res)
			const result = data
				.sort((a, b) => {
					const aVal = parseFloat(a["24h_volume_usd"])
					const bVal = parseFloat(b["24h_volume_usd"])
					if (isNaN(aVal)) {
						return 1
					}
					if (isNaN(bVal)) {
						return -1
					}
					
					if (aVal < bVal) {
						return 1
					} else if (aVal > bVal) {
						return -1
					} else {
						return 0
					}
				})
				.slice(0,3)
				
			
			const answer = result.map( c => {
				return `${c.name} mit einem Handelsvolumen von ${c["24h_volume_usd"].split('.')[0]} US Dollar`
			})
			this.emit(':tell', `Die meistgehandelten Kryptowährungen in den letzten 24 Stunden sind: ${answer[0]}, ${answer[1]} und ${answer[2]}.`)
		  })
		})
	},
	'GetTrendPercentIntent': function () {
		https.get('https://api.coinmarketcap.com/v1/ticker/?limit=0', (response) => {
		  
		  let res = ''
		  response.on('data', (data) => {
			res += data.toString()
		  })
		  
		  response.on('end', () => {
			const data = JSON.parse(res)
			const result = data
				.sort((a, b) => {
					const aVal = parseFloat(a["percent_change_24h"])
					const bVal = parseFloat(b["percent_change_24h"])
					if (isNaN(aVal)) {
						return 1
					}
					if (isNaN(bVal)) {
						return -1
					}
					if (aVal < bVal) {
						return 1
					} else if (aVal > bVal) {
						return -1
					} else {
						return 0
					}
				})
				.slice(0,3)
			
			
			
			const answer = result.map( c => {
				const [percent, decimals] = c["percent_change_24h"].split('.')
				const change = `${percent} komma ${decimals.split('').join(' ')}`
				return `${c.name} mit einem prozentualen Wachstum von ${change} Prozent`
			})
			this.emit(':tell', `Die Kryptowährungen mit dem größten prozentualen Wachstum in den letzten 24 Stunden sind: ${answer[0]}, ${answer[1]} und ${answer[2]}.`)
		  })
		}) 
	},
	'AMAZON.HelpIntent': function () {
		const speechOutput = 'Du kannst sagen: "Alexa öffne Kryptotrend". Wie kann ich dir helfen?';
		const reprompt = 'Wie kann ich dir helfen?';
		this.emit(':ask', speechOutput, reprompt);
	},
	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Auf Wiedersehen!');
	},
	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Auf Wiedersehen!');
	},
	'SessionEndedRequest': function () {
		this.emit(':tell', 'Auf Wiedersehen!');
	},
	'Unhandled': function () {
		this.emit(':tell', 'Es tut mir Leid! Das habe ich nicht verstanden. Du kannst sagen: "Alexa öffne Kryptotrend". Versuche es erneut.');
	}
};

exports.handler = function (event, context) {
	const alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
};
