"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const botbuilder_1 = require("botbuilder");
const ACData = require("adaptivecards-templating");
class Utils {
    // Bind AdaptiveCard with data
    static renderAdaptiveCard(rawCardTemplate, dataObj) {
        const cardTemplate = new ACData.Template(rawCardTemplate);
        const cardWithData = cardTemplate.expand({ $root: dataObj });
        const card = botbuilder_1.CardFactory.adaptiveCard(cardWithData);
        return card;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map