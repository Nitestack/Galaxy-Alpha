import GalaxyAlpha from '@root/Client';

export interface FeatureRunner {
	(client: GalaxyAlpha): Promise<void>;
};

export default class Feature {
	public name: string;
	constructor(client: GalaxyAlpha, info: {
		name: string
	}){
		this.name = info.name;
		this.validateInfo(client, {
			name: this.name
		});
	};
	validateInfo(client: GalaxyAlpha, info: {
		name: string
	}){
		if (!client) throw new Error("A client must be specified!");
		if (!info.name) throw new Error("A feature name must be specified!");
		if (typeof info.name != 'string') throw new TypeError("The feature name must be a string!");
		if (info.name != info.name.toLowerCase()) throw new RangeError("The feature name must be in lowercase");
	};
	async run(client: GalaxyAlpha): Promise<void>{
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};