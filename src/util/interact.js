require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x6f3f635A9762B47954229Ea479b4541eAF402A6A";

//load smart contract from Ethereum blockchain using web3 lib
export const helloWorldContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

//load current message of smart contract
export const loadCurrentMessage = async () => {
    const message = await helloWorldContract.methods.message().call();
    return message;
};

//connect dApp to Metamask wallet
export const connectWallet = async () => {
    //when Metamask is installed
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above",
                address: addressArray[0],
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        //when Metamask is not installed
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊 {" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            )
        };
    }
};

//check if Metamask wallet is connected to dApp or not
export const getCurrentWalletConnected = async () => {

};

//update message of smart contract, this tx is signed by Metamask wallet
export const updateMessage = async (address, message) => {

};
