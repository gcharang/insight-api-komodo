'use strict';

var request = require('request');

function CurrencyController(options) {
  this.node = options.node;
  var refresh = options.currencyRefresh || CurrencyController.DEFAULT_CURRENCY_DELAY;
  this.currencyDelay = refresh * 60000;
  this.timestamp = Date.now();
}

CurrencyController.DEFAULT_CURRENCY_DELAY = 10;

CurrencyController.prototype.index = function(req, res) {
  var ARRRRate;
  var rate;
  var result1;
  var result2;
  var self = this;
  var currentTime = Date.now();
  if (self.bitstampRate === 0 || currentTime >= (self.timestamp + self.currencyDelay)) {
    self.timestamp = currentTime;
    // https://bittrex.com/api/v1.1/public/getticker?market=BTC-KMD
    // request('https://www.bitstamp.net/api/ticker/', function(err, response, body) {

    request('https://tradeogre.com/api/v1/ticker/BTC-ARRR', function(err, response, body) {
      if (err) {
        self.node.log.error(err);
      }
      if (!err && response.statusCode === 200) {
        result1 = JSON.parse(body);
        ARRRRate = result1.price;
      //  console.log("[Decker]1:self.result1.price: " + JSON.stringify(ARRRRate));
         
      }

      request('https://bittrex.com/api/v1.1/public/getticker?market=USD-BTC', function(err, response, body) {
      if (err) {
        self.node.log.error(err);
      }
      if (!err && response.statusCode === 200) {
        result2 = JSON.parse(body);
        rate = result2.result.Last;
        //console.log("[Decker]2:self.result2.rate: " + JSON.stringify(rate));
         
      }
        var USDrate = parseFloat(ARRRRate) * parseFloat(rate);
        //console.log("[Decker] USDrate: "+ ARRRRate + ' ' + rate  + ' ' + USDrate)
        res.jsonp({
          status: 200,
          netSymbol: "ARRR",
          timestamp: self.timestamp,
          data: {
            bitstamp: USDrate
  
          }});
      });
    });
  }

};

module.exports = CurrencyController;
