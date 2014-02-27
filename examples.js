
var Money = require('./bigmoney.js')

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


var usd = Money(100, 'EUR').convert('USD');

//get numeric value

console.log( usd.valueOf() ); //134.85

//get string value

console.log( usd.toString() ); //"134.85"
console.log( "" + usd );       //"134.85"

//get formatted string

console.log( usd.format() );             //"134.85 USD"
console.log( usd.format("$ %decimal") ); //"$ 134.85"

//set custom formatter

Money.formatter = function(decimal, currency, formatParam) {
    switch(currency) {
        case 'USD': return "$" + decimal;
        case 'EUR': return "€" + decimal;
        case 'JPY': return "¥" + decimal;
        default: return decimal + " " + currency;
    }
}

console.log( Money(100, 'EUR').format() );                //"€100"
console.log( Money(100, 'EUR').convert("JPY").format() ); //"¥13757.4"
console.log( Money(100, 'EUR').convert("RUB").format() ); //"4752.76 RUB"


//calculate money values

console.log( usd.plus(100).valueOf() );  //234.85
console.log( usd.minus(100).valueOf() );  //34.85
console.log( usd.times(2).valueOf() );  //269.7
console.log( usd.div(2).valueOf() );  //67.43
console.log( usd.mod(1).valueOf() );  //0.85

//allocates money
new Money(100).allocate(3).forEach(function(payment) {
    //five payments of "same value"
    console.log(payment.format());
});

new Money(100).allocate([1, 1, 1]).forEach(function(payment) {
    //three equal payments, same as ".allocate(3);" (above example)
    console.log(payment.format());
});

new Money(100).allocate([1, 2, 1]).forEach(function(payment) {
  //three payments, 25% then 50% then 25%
    console.log(payment.format());
});