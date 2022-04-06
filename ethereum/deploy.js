const walletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../ethereum/build/Factory.json");
const fs = require("fs");
require("dotenv").config();

const provider = new walletProvider(process.env.mneumonic, process.env.network);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Using account: ", accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  const d = new Date();
  fs.appendFile(
    "address.txt",
    `\naddress_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}_${d.getHours()}_${d.getMinutes()}:"${
      result.options.address
    }"`,
    (err) => {
      if (err) throw err;
      console.log("Address added to file");
    }
  );
};

deploy();
