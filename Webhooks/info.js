const Discord = require('discord.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { defaultColor, profile } = require('@root/config.json');

const infohook = new Discord.WebhookClient(
	'784547523875831809',
	'Ed9H60JjIoVFVBKd2Xw7zu3uOVDD7vjKy6Qs_V821TCKIBxSt4bR30p_vzaWBOVzK0a3'
);
const infoembed = new Discord.MessageEmbed()
	.setTitle('Galaxy Alpha')
	.setColor(defaultColor)
	.setURL(
		'https://discord.com/api/oauth2/authorize?client_id=761590139147124810&permissions=8&scope=bot'
	)
	.setDescription(
		`Welcome to the Galaxy Alpha Support Server!
    [Add Galaxy Alpha](https://discord.com/api/oauth2/authorize?client_id=761590139147124810&permissions=8&scope=bot)`
	)
	.setFooter(`Powered By Galaxy Alpha`, profile)
	.setThumbnail(profile);
infohook.send(infoembed);
console.log('Run the webhook info.js!');
