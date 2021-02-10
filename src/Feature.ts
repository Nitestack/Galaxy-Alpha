import GalaxyAlpha from '@root/Client';

export interface FeatureRunner {
	(client: GalaxyAlpha): Promise<unknown>;
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
	};
	public run: FeatureRunner = async (client: GalaxyAlpha): Promise<unknown> => {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};