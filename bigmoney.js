/**
 * Library for handling money:
 * - mathematical operations
 * - work with different currencies
 * - formatted output
 *
 * @example Money(3300, 'USD').plus(99.01).convert('RUB').format()
 */

;(function (root, undefined) {

    var Big = root.Big || require('big.js');

    var settings = {
        base: "USD",
        rates: {
            //USD : 1, //this is base. Other rates relative to the USD
            //"RUB": 35.2448,
            //"EUR": 1/1.3485,
            //"JPY": 102.02
        },
        format: "%decimal %currency"
    };

    function Money(val, currency, options) {
        if (!(this instanceof Money)) {
            return new Money(val, currency, options);
        }

        if (arguments.length === 2 && typeof currency === 'object') {
            options = currency;
            currency = undefined;
        }
        this.options = options || {};

        this.val = Big(val);
        this.currency = currency || this.options.currency || Money.settings.base;
    }

    /**
     * wrap Big.js methods
     */

    Money.prototype.abs = function () {
        return Money(this.val.abs.apply(this.val, arguments), this.currency, this.options);
    }

    Money.prototype.cmp = function () {
        return this.val.cmp.apply(this.val, arguments);
    }

    Money.prototype.div = function () {
        return Money(this.val.div.apply(this.val, arguments), this.currency, this.options);
    }

    Money.prototype.eq = function () {
        return this.val.eq.apply(this.val, arguments);
    }

    Money.prototype.gt = function () {
        return this.val.gt.apply(this.val, arguments);
    }

    Money.prototype.gte = function () {
        return this.val.gte.apply(this.val, arguments);
    }

    Money.prototype.lt = function () {
        return this.val.lt.apply(this.val, arguments);
    }

    Money.prototype.lte = function () {
        return this.val.lte.apply(this.val, arguments);
    }

    Money.prototype.minus = function () {
        return Money(this.val.minus.apply(this.val, arguments), this.currency, this.options);
    }

    Money.prototype.mod = function () {
        return Money(this.val.mod.apply(this.val, arguments), this.currency, this.options);
    }

    Money.prototype.plus = function () {
        return Money(this.val.plus.apply(this.val, arguments), this.currency, this.options);
    }

    Money.prototype.pow = function () {
        return this.val.pow.apply(this.val, arguments);
    }

    Money.prototype.round = function () {
        return Money(this.val.round.apply(this.val, arguments), this.currency, this.options);
    }

    Money.prototype.sqrt = function () {
        return Money(this.val.sqrt.apply(this.val, arguments), this.currency, this.options);
    }

    Money.prototype.times = function () {
        return Money(this.val.times.apply(this.val, arguments), this.currency, this.options);
    }

    /**
     * Allocates amounts of money in an array so that you won't loose cents
     * @param ratios {Number} How many parts you want to divide the initial amount.
     * @returns {*}
     */

    function sum(a, b) {
        return a + b;
    }

    function ones(len) {
        var arr = [];
        for (var i = 0; i < len; i++) {
            arr.push(1);
        };

        return arr;
    }

    Money.prototype.allocate = function(ratios) {
        if(typeof ratios === 'undefined') {
            return [this];
        } else if(typeof ratios === 'number') {
            ratios = ones(ratios);
        }

        var amount = this,
            remainder = amount,
            total = ratios.reduce(sum),
            results = [],
            current = 0;

        ratios.forEach(function(ratio, index) {
            results.push(amount.times(ratio).div(total));
            remainder = remainder.minus(results[index]);
        });

        while(!remainder.eq(0)) {
            results[current] = results[current++].plus(0.01 * remainder.val.s);

            if(current >= results.length) {
                current = 0;
            }

            remainder = remainder.plus(0.01 * remainder.val.s * -1);
        }

        return results;
    }

    /**
     * Convert to over currency
     * @param to {String} Destination currency. Default is a settings.base currency.
     * @returns {*}
     */

    Money.prototype.convert = function (to) {
        to || (to = Money.settings.base);
        var rate, val, from = this.currency;
        if (from === to) return Money(this.val, to, this.options);
        if (from === Money.settings.base) {
            rate = Money.settings.rates[to];
            if (rate === undefined) throw new Error('Unknown rate for "' + to + '" currency');
            val = this.val.times(rate);
            return Money(val, to, this.options);
        }
        else if (to === Money.settings.base) {
            rate = Money.settings.rates[from];
            if (rate === undefined) throw new Error('Unknown rate for "' + from + '" currency');
            val = rate === 0 ? 0 : this.val.div(rate);
            return Money(val, to, this.options);
        }
        else {
            return (this.convert(Money.settings.base)).convert(to);
        }
    }

    /**
     * Return value as number
     * @returns {Number}
     */

    Money.prototype.valueOf = function () {
        return parseFloat(this.val.round(2).valueOf());
    }

    /**
     * Return value as string
     * @returns {string}
     */

    Money.prototype.toString = function () {
        return this.val.round(2).valueOf();
    }

    /**
     * Return formatted string
     * @returns {string}
     */

    Money.prototype.format = function (formatTemplate) {
        return Money.formatter(this.valueOf(), this.currency, formatTemplate);
    }

    Money.isValidCurrency = function (curr) {
        return typeof Money.settings.rates[curr] === 'number';
    }

    Money.settings = settings;
    Money.formatter = function(decimal, currency, formatTemplate)   {
        formatTemplate || (formatTemplate = Money.settings.format);
        return formatTemplate.replace('%decimal', decimal).replace('%currency', currency);
    };

    // EXPORT

    // Node and other CommonJS-like environments that support module.exports.
    if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = Money

        //AMD.
    } else if ( typeof define == 'function' && define.amd ) {
        define( function () {
            return Money
        })

        //Browser.
    } else {
        Money.noConflict = (function(oldMoney) {
            return function() {
                // Reset the value of the root's `accounting` variable:
                root.Money = oldMoney;
                // Delete the noConflict method:
                Money.noConflict = undefined;
                // Return reference to the library to re-assign it:
                return Money;
            };
        })(root.Money);

        root['Money'] = Money;
    }

})(this);
