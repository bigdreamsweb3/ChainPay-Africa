// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainPay_Airtime
 * @dev A blockchain-based payment system for purchasing airtime using multiple ERC-20 tokens.
 * The contract owner can add/remove accepted tokens and manage withdrawals.
 */
contract ChainPay_Airtime is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Enum for supported networks
    enum Network {
        MTN,
        Airtel,
        Glo,
        Etisalat
    }

    // Mapping of accepted ERC-20 tokens
    mapping(address => bool) public acceptedTokens;

    // Transaction structure for logging purchases
    struct Transaction {
        address user;
        string phoneNumber;
        uint256 amount;
        Network network;
        address token;
        uint256 timestamp;
        bool completed;
        string creditAmount;
    }

    // Storage for transactions
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCounter;

    // Events
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event AirtimePurchase(
        uint256 indexed txId,
        address indexed user,
        string phoneNumber,
        uint256 amount,
        Network network,
        address token,
        uint256 timestamp,
        string creditAmount
    );
    event Withdrawal(address indexed admin, address token, uint256 amount, uint256 timestamp);

    /**
     * @dev Constructor initializes the contract with an initial accepted token.
     * @param _initialToken Address of the initial accepted token.
     */
    constructor(address _initialToken) Ownable(msg.sender) {
        require(_initialToken != address(0), "Invalid token address");
        acceptedTokens[_initialToken] = true;
    }

    /**
     * @dev Adds a new ERC-20 token to the accepted tokens list.
     */
    function addAcceptedToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!acceptedTokens[token], "Token already accepted");

        acceptedTokens[token] = true;
        emit TokenAdded(token);
    }

    /**
     * @dev Removes an accepted ERC-20 token from the list.
     */
    function removeAcceptedToken(address token) external onlyOwner {
        require(acceptedTokens[token], "Token not accepted");

        delete acceptedTokens[token];
        emit TokenRemoved(token);
    }

    /**
     * @dev Internal function to process token payments securely.
     */
    function processPayment(address token, uint256 amount) internal {
        require(acceptedTokens[token], "Token not supported");
        require(amount > 0, "Invalid amount");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    /**
     * @dev Allows users to buy airtime.
     */
    function buyAirtime(
        string calldata phoneNumber,
        uint256 amount,
        Network network,
        address token,
        string calldata creditAmount
    ) external nonReentrant {
        processPayment(token, amount);

        unchecked {
            transactionCounter++;
        }

        transactions[transactionCounter] = Transaction(
            msg.sender,
            phoneNumber,
            amount,
            network,
            token,
            block.timestamp,
            false,
            creditAmount
        );

        emit AirtimePurchase(
            transactionCounter,
            msg.sender,
            phoneNumber,
            amount,
            network,
            token,
            block.timestamp,
            creditAmount
        );
    }

    /**
     * @dev Allows the owner to withdraw collected funds.
     */
    function withdrawFunds(address token, uint256 amount) external onlyOwner nonReentrant {
        require(acceptedTokens[token], "Token not supported");

        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdrawal(msg.sender, token, amount, block.timestamp);
    }
}
