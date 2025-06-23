// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract KKCoin is ERC20, Ownable {
  constructor() ERC20("KKCoin", "KKC") Ownable(msg.sender) {
    _mint(msg.sender, 1000000 * 10 ** decimals());
  }
}