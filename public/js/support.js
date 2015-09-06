/**
 * Created by cvargasc on 4/09/15.
 */
var css = {};

for (var i = 0; i < document.styleSheets.length; ++i) {
    var sheet = document.styleSheets[i];
    for (var j = 0; j < sheet.cssRules.length; ++j) {
        var rule = sheet.cssRules[j];

        var cssText = rule.cssText.slice(rule.cssText.indexOf('{')+1);
        var attrs = cssText.split(';');

        var ruleSet = {};
        for (var k = 0; k < attrs.length; ++k) {
            var keyValue = attrs[k].split(':');
            if (keyValue.length == 2) {
                var key = keyValue[0].trim();
                var value = keyValue[1].trim();
                ruleSet[key] = value;
            }
        }

        for (var testRule in ruleSet) { // We are going to add the rule iff it is not an empty object
            css[rule.selectorText] = ruleSet;
            break;
        }
    }
}