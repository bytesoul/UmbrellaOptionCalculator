# UmbrellaOptionCalculator
Uses the Umbrella Network to calculate the price of an option using the Black-Scholes pricing model

To run clone the repo and then run ```npm install```

Replace the example.env with an .env with your own keys.
  * The example is using the kovan testnet values

Then ```npm start``` will execute
  This result will be an Eth option price based on data from the umbrella network and the Black-Scholes pricing model
  
  
## Some Limitations of this code
  * Come data is hardcoded such as the strike price and the maturity date
    * This should be replaced with a chain data pulled from the network where the option market is
  * Using the 10 year bond may not be the best proxy for risk free return should be replaced with Aave or Compound return rates or possibly another data feed from Umbrella
  * There are better pricing models being used for option prices. Selecting one that is already used by current crypto exchanged would be a better solution
  * There are a lot more calculations that can be added for example the greeks or IV percentage (IV measured against itself) to give traders more information
    
## Notes for Umbrella
   * Please add the ability to get current keys into your api (or if it there add it to the documentation)
   * Consider adding a longer dated volatility to your keys a 128 day would be great
   * Consider adding in Treasury bond yields to the set of keys
    
## Conclusion
  I thoroughly enjoyed working with the Umbrella Network and I think it is in an excellent position to help programmers build awesome on chain option products that the space is lacking at the moment.
  
