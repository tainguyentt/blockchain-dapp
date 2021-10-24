import React from "react";
import { useEffect, useState } from "react";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
  unavailableMetamaskInfo,
} from "./util/interact.js";

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState(""); //store user's wallet address
  const [status, setStatus] = useState(""); //store current status
  const [message, setMessage] = useState("No connection to the network."); //store current message in smart contract
  const [newMessage, setNewMessage] = useState(""); //store new message that will be added

  //React hook, called after the component is rendered
  useEffect(async () => {
    //load current stored message in smart contract
    const message = await loadCurrentMessage();
    setMessage(message);

    //listen to any change from smart contract
    addSmartContractListener();

    //load status and address of wallet if connected
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    //listen to any change from Metamask wallet
    addWalletListener();

  }, []); //called only once

  //watch for contract UpdateMessages event
  //update UI when the message in contract is changed
  function addSmartContractListener() {
    helloWorldContract.events.UpdatedMessages({}, (error, data) => {
      if (error) {
        setStatus("😥 " + error.message);
      } else {
        setMessage(data.returnValues[1]);
        setNewMessage("");
        setStatus("🎉 Your message has been updated!");
      }
    });
  }

  //detect changes in user's Metamask wallet state e.g. disconnect, switch addresses
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      })
    } else {
      setStatus(unavailableMetamaskInfo);
    }
  }

  //connect the Metamask wallet to dApp
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  //user want to update message stored in smart contract
  const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
  };

  //the UI of our component
  return (
    <div id="container">
      {/* <img id="logo" src={alchemylogo}></img> */}

      {/* Connect to Metamask wallet */}
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      {/* Show current message */}
      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      {/* Update message in smart contract */}
      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>
      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
    </div>
  );
};

export default HelloWorld;
