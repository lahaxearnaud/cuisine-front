app.factory('math', function () {
    return {
        closestFraction: function (value, tol) {
            if (!tol) {
                tol = 0.05;
            }

            if (Math.floor(value) == value) {
                return {numerator: value, denominator: 1};
            }

            var original_value = value;
            var iteration = 0;
            var denominator = 1, last_d = 0, numerator;
            while (iteration < 20) {
                value = 1 / (value - Math.floor(value));
                var _d = denominator;
                denominator = Math.floor(denominator * value + last_d);
                last_d = _d;
                numerator = Math.ceil(original_value * denominator);

                if (Math.abs(numerator / denominator - original_value) < tol) {
                    break;
                }

                iteration++;
            }
            return {numerator: numerator, denominator: denominator};
        },

        getValue: function (str) {
            try {
                return eval(str);
            } catch(err) {
                return false
            }
        },

        getRatio: function (initial, final) {
            return final / initial;
        },

        applyRation: function (value, ratio) {
            return value * ratio;
        },

        toString: function (faction) {
            if(faction.denominator ===  1) {
                return faction.numerator;
            }

            var value = faction.numerator/faction.denominator;
            var rounded = Math.round(value * 100) / 100;

            if(rounded > 15) {
                return Math.floor(value);
            }

            // only two decimals
            if(rounded == value) {
                var decimal = (rounded - Math.floor(value)) * 100;
                if(_.indexOf([25, 50, 75], decimal) != -1) {
                    return rounded;
                }
            }

            return faction.numerator + "/" + faction.denominator + ' (' + rounded + ')';
        }
    };
});
