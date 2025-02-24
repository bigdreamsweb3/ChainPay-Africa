// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainPay
 * @dev A blockchain-based payment system that allows users to purchase airtime, data, and pay bills
 * using multiple accepted ERC-20 tokens. The owner can add or remove supported tokens.
 */
contract ChainPay is Ownable {
    // Mapping of accepted ERC-20 tokens
    mapping(address => bool) public acceptedTokens;

    // Transaction structure to log service purchases
    struct Transaction {
        address user;
        string phoneNumber;
        uint256 amount;
        string serviceType;
        string network;
        string dataPlan;
        string billType;
        uint256 timestamp;
        bool completed;
        address token;
    }

    // Storage for transactions
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCounter;

    // Events
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event AirtimePurchase(
        address indexed user,
        string phoneNumber,
        uint256 amount,
        string network,
        address token,
        uint256 timestamp
    );
    event DataPurchase(
        address indexed user,
        string phoneNumber,
        uint256 amount,
        string network,
        string dataPlan,
        address token,
        uint256 timestamp
    );
    event BillPayment(
        address indexed user,
        string billType,
        uint256 amount,
        string accountNumber,
        address token,
        uint256 timestamp
    );
    event Withdrawal(address indexed admin, address token, uint256 amount, uint256 timestamp);

    /**
     * @dev Constructor initializes the contract with an initial accepted token and sets the owner.
     * @param _usdcToken Address of the initial accepted token.
     */
    constructor(address _usdcToken) Ownable(msg.sender) {
        acceptedTokens[_usdcToken] = true;
    }

    /**
     * @dev Adds a new ERC-20 token to the accepted payment options.
     */
    function addAcceptedToken(address token) external onlyOwner {
        require(token != address(0) && !acceptedTokens[token], "Invalid or already accepted token");
        acceptedTokens[token] = true;
        emit TokenAdded(token);
    }

    /**
     * @dev Removes an accepted ERC-20 token from the payment options.
     */
    function removeAcceptedToken(address token) external onlyOwner {
        require(acceptedTokens[token], "Token not accepted");
        delete acceptedTokens[token];
        emit TokenRemoved(token);
    }

    /**
     * @dev Internal function to process token payments.
     */
    function processPayment(address token, uint256 amount) internal {
        require(acceptedTokens[token], "Token not supported");
        require(amount > 0, "Invalid amount");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Payment failed");
    }

    /**
     * @dev Allows users to buy airtime.
     */
    function buyAirtime(
        string calldata phoneNumber,
        uint256 amount,
        string calldata network,
        address token
    ) external {
        processPayment(token, amount);
        transactions[++transactionCounter] = Transaction(
            msg.sender, phoneNumber, amount, "airtime", network, "", "", block.timestamp, false, token
        );
        emit AirtimePurchase(msg.sender, phoneNumber, amount, network, token, block.timestamp);
    }

    /**
     * @dev Allows users to buy data.
     */
    function buyData(
        string calldata phoneNumber,
        uint256 amount,
        string calldata network,
        string calldata dataPlan,
        address token
    ) external {
        processPayment(token, amount);
        transactions[++transactionCounter] = Transaction(
            msg.sender, phoneNumber, amount, "data", network, dataPlan, "", block.timestamp, false, token
        );
        emit DataPurchase(msg.sender, phoneNumber, amount, network, dataPlan, token, block.timestamp);
    }

    /**
     * @dev Allows users to pay bills.
     */
    function payBill(
        string calldata billType,
        uint256 amount,
        string calldata accountNumber,
        address token
    ) external {
        processPayment(token, amount);
        transactions[++transactionCounter] = Transaction(
            msg.sender, "", amount, "bill", "", "", billType, block.timestamp, false, token
        );
        emit BillPayment(msg.sender, billType, amount, accountNumber, token, block.timestamp);
    }

    /**
     * @dev Allows the contract owner to withdraw collected funds.
     */
    function withdrawFunds(address token, uint256 amount) external onlyOwner {
        require(acceptedTokens[token], "Token not supported");
        require(IERC20(token).transfer(msg.sender, amount), "Withdrawal failed");
        emit Withdrawal(msg.sender, token, amount, block.timestamp);
    }
}
