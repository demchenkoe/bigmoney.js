# bigmoney.js #
Library for handling the money values.
Support multiple currencies.
Based on big.js library for arbitrary-precision decimal arithmetic.

## Load

The library is the single JavaScript file *bigmoney.js* (or *bigmoney-all.min.js*, which is *bigmoney.js* with all dependencies and minified).

It can be loaded via a script tag in an HTML document for the browser

    <script src='./relative/path/to/bigmoney-all.min.js'></script>

or as a CommonJS, [Node.js](http://nodejs.org) or AMD module using `require`.

For Node, put it in a *node_modules* directory within the directory and use `require('bigmoney')`.

To load with AMD loader libraries such as [requireJS](http://requirejs.org/):

    require(['bigmoney'], function(BigMoney) {
        // Use BigMoney here in local scope. No global Big.
    });


## Use

Setup settings

    Money.settings = {
        base: "USD",
        rates: {
            USD : 1, //this is base. Other rates relative to the base.
            RUB: 35.2448,
            EUR: 1/1.3485,
            JPY: 102.02
        },
        format: "%decimal %currency"
    }


Constructor

    var eur  = Money(100, 'EUR');
    var usd  = Money(100, 'EUR').convert('USD');
    var usd2 = Money(250);   //equal Money(250, Money.settings.base);

    //get numeric value

    usd.valueOf();             //134.85

    //get string value

    usd.toString();            //"134.85"

    //get formatted string

    usd.format();             //"134.85 USD"
    usd.format("$ %decimal"); //"$ 134.85"

Convert currency

    var usd = eur.convert('USD');
    //or
    var usd = Money(100, 'EUR').convert('USD')
    //or
    console.log( Money(100, 'EUR').convert('USD').format() )  //"134.85 USD"

Setup custom formatter

    Money.formatter = function(decimal, currency, formatParam) {
        switch(currency) {
            case 'USD': return "$" + decimal;
            case 'EUR': return "€" + decimal;
            case 'JPY': return "¥" + decimal;
            default: return decimal + " " + currency;
        }
    }

    Money(100, 'EUR').format();                //"€100"
    Money(100, 'EUR').convert("JPY").format(); //"¥13757.4"
    Money(100, 'EUR').convert("RUB").format(); //"4752.76 RUB"


Arbitrary-precision decimal arithmetic provided by big.js library

    usd.valueOf();             //134.85
    usd.plus(100).valueOf();   //234.85
    usd.minus(100).valueOf();  //34.85
    usd.times(2).valueOf();    //269.7
    usd.div(2).valueOf();      //67.43
    usd.mod(1).valueOf();      //0.85

## Build

For Node, if uglify-js is installed globally ( `npm install uglify-js -g` ) then

	cat node_modules/big.js/big.js bigmoney.js | uglifyjs -o bigmoney-all.min.js


## Author

Eugene Demchenko it-bm@mail.ru skype: demchenkoe

## Licence

See LICENCE.

## Thanks

Big thanks for Michael Mclaughlin (author of big.js library).