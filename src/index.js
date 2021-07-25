import { ContractRegistry, ChainContract, APIClient } from '@umb-network/toolbox';
import { ethers } from 'ethers';
import * as env from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const fetch = require( 'node-fetch');
const util = require('util');


env.config();//pull in the .env file

async function main() {
    let keys = await fetch(process.env.API_BASE_URL.concat("keys/layer2")).then(res => res.json());//grab all the layer 2 keys
    //console.log(keys[21]);
  if (process.env.BLOCKCHAIN_PROVIDER_URL && process.env.REGISTRY_CONTRACT_ADDRESS && process.env.API_KEY) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER_URL);

    const contractRegistry = new ContractRegistry(provider, process.env.REGISTRY_CONTRACT_ADDRESS);
    const chainContractAddress = await contractRegistry.getAddress('Chain');
    const chainContract = new ChainContract(provider, chainContractAddress);
    const apiClient = new APIClient({
      baseURL: process.env.API_BASE_URL,
      chainContract,
      apiKey: process.env.API_KEY,
    });
    
    const currentPrice  = await apiClient.verifyProofForNewestBlock('ETH-USD'); //grab current price
    const currentVol    = await apiClient.verifyProofForNewestBlock(keys[40]);  //grab 28 day vol
    const strikePrice   = 2500;     //set an example strike price
    const optionType    = "call";   //calculate for a call
    const riskfreereturn= .013;     //use 10 year treasury risk free return as proxy
    const maturityTime  = .5;       //set a maturity time for 6 months

    console.log(util.format("Calculating option price based on a curent price:%s a strike price of:%s a maturity of:%s years a riskfree return of:%s and a volatility of:%s ",currentPrice.value,strikePrice,maturityTime,riskfreereturn,currentVol.value/100.0));
    console.log(util.format("Calculating option price based on these parameters result: %s",optionCalc(optionType,currentPrice.value,strikePrice,maturityTime,riskfreereturn,currentVol.value/100.0)));
  }
}

/*
*optionType (put/call)
* S curent stock price
* X strike Price
* T time to maturity in years
* r Risk free return rate (based on 10 year  treasury 1.3% .013)
* v volatility anualized (GVol-ETH-IV-28days) key[40]
* http://cseweb.ucsd.edu/~goguen/courses/130/SayBlackScholes.html
*/

function optionCalc(optionType, S,X,T,r,v){// By Espen Gaarder Haug  (thanks to Kurt Hess at University of Waikato for finding a bug in my code)
  var d1,d2;
  d1 = (Math.log(S/X)+(r+v*v/2.0)*T)/(v*Math.sqrt(T));
  d2 = d1-v*Math.sqrt(T);

  if(optionType =="call")
    return S*CND(d1)-X*Math.exp(-r*T)*CND(d2);
  else
    return X*Math.exp(-r*T)*CND(-d2)-S*CND(-d1);


}
function CND(x){// By Espen Gaarder Haug  (thanks to Kurt Hess at University of Waikato for finding a bug in my code)
  var a1,a2,a3,a4,a5,k;

  a1 = 0.31938153,a2=-0.356563782,a3=1.781477937,a4=-1.821255978,a5=1.330274429;

  if (x<0.0)
    return 1-CND(-x);
  else{
    k = 1.0/(1.0+0.2316419*x);
    return 1.0-Math.exp(-x*x/2.0)/Math.sqrt(2*Math.PI)*k*(a1+k*(a2+k*(a3+k*(a4+k*a5))));
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });