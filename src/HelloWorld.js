import React from "react";
import { useEffect, useState } from "react";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState(""); //store user's wallet address
  const [status, setStatus] = useState(""); //store current status
  const [message, setMessage] = useState("No connection to the network."); //store current message in smart contract
  const [newMessage, setNewMessage] = useState(""); //store new message that will be added

  //React hook, called after the component is rendered
  useEffect(async () => {
    const message = await loadCurrentMessage();
    setMessage(message);
  }, []); //called only once

  //watch for contract UpdateMessages event
  //update UI when the message in contract is changed
  function addSmartContractListener() { //TODO: implement
    
  }

  //detect changes in user's Metamask wallet state e.g. disconnect, switch addresses
  function addWalletListener() { //TODO: implement
    
  }

  //connect the Metamask wallet to dApp
  const connectWalletPressed = async () => { //TODO: implement
    
  };

  //user want to update message stored in smart contract
  const onUpdatePressed = async () => { //TODO: implement
    
  };

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" src={alchemylogo}></img>

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
