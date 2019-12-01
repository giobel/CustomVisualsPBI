import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api"
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var mlcC5145AC231E64425B741577D7708A208_DEBUG: IVisualPlugin = {
    name: 'mlcC5145AC231E64425B741577D7708A208_DEBUG',
    displayName: 'mlc',
    class: 'Visual',
    apiVersion: '2.6.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        console.error('Visual instance not found');
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["mlcC5145AC231E64425B741577D7708A208_DEBUG"] = mlcC5145AC231E64425B741577D7708A208_DEBUG;
}

export default mlcC5145AC231E64425B741577D7708A208_DEBUG;