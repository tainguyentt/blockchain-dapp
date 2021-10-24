require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x86CF8Ce0b2Ae78Eb1B0b28A15B2Ffb4DeF2e2f5c";

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
                method: "eth_requestAccounts", //open Metamask for the user to connect
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above",
                address: addressArray[0],
            }
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        //when Metamask is not installed
        return unavailableMetamaskInfo;
    }
};

//check if Metamask wallet is connected to dApp or not
export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts", //return Metamask addresses currently connected to dApp
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above."
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return unavailableMetamaskInfo;
    }
};

export const unavailableMetamaskInfo = {
    address: "",
    status: (
        <span>
            <p>
                {" "}
                🦊 {" "}
                <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                    You must install Metamask, a virtual Ethereum wallet, in your browser.
                </a>
            </p>
        </span>
    )
};

//update message of smart contract, this tx is signed by Metamask wallet
export const updateMessage = async (address, message) => {
    //check if Metamask is installed and connected
    if (!window.ethereum | address === null) {
        return {
            status: "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    //validate input data
    if (message.trim() === "") {
        return {
            status: "❌ Your message cannot be an empty string.",
        };
    }

    //create a transaction
    const transactionParams = {
        to: contractAddress,
        from: address,
        data: helloWorldContract.methods.update(message).encodeABI(),
    };

    //submit transaction
    try {
        const txHash = await window.ethereum.request({//how Metamask submits transaction? probably Metamask runs a full node
            method: "eth_sendTransaction",
            params: [transactionParams],
        });

        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" rel="noreferrer" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, the message will
                    be updated automatically.
                </span>
            ),
        };

    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
};
