import Command, { CommandRunner } from '@root/Command';
import fetch from 'node-fetch';

export default class ColorCommand extends Command {
	constructor() {
		super({
			name: "color",
			description: "sends a random embed with the color and it's infos",
			category: "miscellaneous",
			usage: "color [color]"
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		var randomColor = Math.floor(Math.random() * 16777215).toString(16);
		if (args[0]) randomColor = args[0];
		let data = await fetch(`https://www.thecolorapi.com/id?hex=${randomColor}`);
		let res = await data.json();
		const color = client.createEmbed()
			.setTitle(res.name.value)
			.setColor(res.hex.value)
			.setThumbnail(`http://singlecolorimage.com/get/${randomColor}/400x400`)
			.addField('**HEX**', '`' + res.hex.value + '`', true)
			.addField('**RGB**', '`' + res.rgb.value + '`', true)
			.addField('**HSL**', '`' + res.hsl.value + '`', true)
			.addField('**HSV**', '`' + res.hsv.value + '`', true)
			.addField('**CMYK**', '`' + res.cmyk.value + '`', true)
			.addField('**XYZ**', '`' + res.XYZ.value + '`', true);
		return message.channel.send(color);
	};
};