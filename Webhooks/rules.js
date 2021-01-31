const Discord = require('discord.js');
const { defaultColor } = require('@root/config.json');

const infohook = new Discord.WebhookClient(
	'784547523875831809',
	'Ed9H60JjIoVFVBKd2Xw7zu3uOVDD7vjKy6Qs_V821TCKIBxSt4bR30p_vzaWBOVzK0a3'
);
const banInfohook = new Discord.WebhookClient(
	'793214596252041246',
	'ZND2r5v_vHnBXamkZk2ioJLuFQMnEKeiXsVw7AuUOOafakiDGX88yfGsOkO4mCY1U1-q'
);
const infoembed = new Discord.MessageEmbed()
	.setTitle('Server Rules')
	.setColor(defaultColor)
	.setDescription(
		"We will always enforce Discord's ToS and Community Guidelines.\n[Discord's Terms of Service](https://discord.com/terms)\n[Discord's Community Guidelines](https://discord.com/guidelines)\n\n<:info:786676407362781195> All rules in the server apply at all times and in all places.\n<:info:786676407362781195> Breaking any of these rules can result in punishment ranging from mutes all the way to permanent bans from the server and bot!\n<:info:786676407362781195> This is an English server, so please don't use other languages!\n<:info:786676407362781195> Some rules are not listed here so please don’t do something that you know you shouldn’t do."
	)
	.addField(
		'<a:hyper_mega:786706703310782476> **#1 : Follow the Discord TOS**',
		"You have to follow the [Discord's Terms of Service](https://discord.com/terms) includes the minimum age of 13 years!"
	)
	.addField(
		'<a:hyper_mega:786706703310782476> **#2 : Primary Language : English**',
		'Any other language you have to go into the international channels.'
	)
	.addField(
		'<a:hyper_mega:786706703310782476> **#3 : No NSFW content of any kind**',
		'NSFW is strictly forbidden in this server! Please use other servers for that type of content!'
	)
	.setFooter(
		`Powered By Galaxy Alpha`,
		'https://cdn.discordapp.com/attachments/784325634716467213/793216162900607026/BanAppeal.png'
	)
	.setThumbnail(
		'https://cdn.discordapp.com/attachments/784325634716467213/793216162900607026/BanAppeal.png'
	);
infohook.send(infoembed);
banInfohook.send(infoembed);
console.log('Run the webhook info.js!');
