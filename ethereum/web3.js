import Web3 from "web3";

let web3;

if (typeof window !== "undefined") {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    console.log("in metamusk");
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    console.log("in legacy metamusk");
  }
} else {
  const provider = new Web3.providers.HttpProvider(process.env.network);
  web3 = new Web3(provider);
  console.log("in browser");
}

export default web3;
