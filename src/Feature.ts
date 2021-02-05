import GalaxyAlpha from '@root/Client';

export interface FeatureRunner {
	(client: GalaxyAlpha): Promise<void>;
};

interface FeatureInfo {
	name: string;
};

export default class Feature {
	public name: string;
	/**
	 * @param {FeatureInfo} info The feature informations
	 */
	constructor(info: FeatureInfo){
		this.name = info.name;
		this.validateInfo({
			name: this.name
		});
	};
	validateInfo(info: {
		name: string
	}){
		if (!info.name) throw new Error("A feature name must be specified!");
		if (typeof info.name != 'string') throw new TypeError("The feature name must be a string!");
		if (info.name != info.name.toLowerCase()) throw new RangeError("The feature name must be in lowercase");
	};
	async run(client: GalaxyAlpha): Promise<void>{
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};