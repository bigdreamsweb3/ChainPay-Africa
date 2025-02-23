// SPDX-License-Identifier: MIT pragma solidity ^0.8.20;

/**

@title ChainPay

@dev A blockchain-based payment system that allows users to purchase airtime, data, and pay bills using multiple accepted ERC-20 tokens.

The contract is designed to support future collaborations with crypto companies by allowing the owner to add or remove supported tokens.

Transactions are securely stored on-chain, and an owner-controlled withdrawal mechanism is provided to settle payments with service providers. */


import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainPay is Ownable { // Mapping of accepted ERC-20 tokens mapping(address => bool) public acceptedTokens;

// Transaction structure to log service purchases
struct Transaction {
    address user;         // Address of the user who initiated the transaction
    string phoneNumber;   // User's phone number (for airtime/data purchases)
    uint256 amount;       // Transaction amount in the selected token
    string serviceType;   // Type of service: "airtime", "data", "bill"
    string network;       // Telecom network (for airtime/data)
    string dataPlan;      // Data plan details (for data purchases)
    string billType;      // Type of bill being paid (for bill payments)
    uint256 timestamp;    // Timestamp of the transaction
    bool completed;       // Status of the transaction
    address token;        // Token used for the transaction
}

// Storage for transactions
mapping(uint256 => Transaction) public transactions;
uint256 public transactionCounter;

// Events for logging contract activity
event TokenAdded(address indexed token);
event TokenRemoved(address indexed token);
event AirtimePurchase(address indexed user, string phoneNumber, uint256 amount, string network, address token, uint256 timestamp);
event DataPurchase(address indexed user, string phoneNumber, uint256 amount, string network, string dataPlan, address token, uint256 timestamp);
event BillPayment(address indexed user, string billType, uint256 amount, string accountNumber, address token, uint256 timestamp);
event Withdrawal(address indexed admin, address token, uint256 amount, uint256 timestamp);

/**
 * @dev Constructor initializes the contract with the first accepted token (e.g., USDC).
 * @param _usdcToken Address of the initial accepted token.
 */
constructor(address _usdcToken) {
    acceptedTokens[_usdcToken] = true;
}

/**
 * @dev Adds a new ERC-20 token to the accepted payment options.
 * Only the contract owner can call this function.
 * @param token Address of the token to be added.
 */
function addAcceptedToken(address token) external onlyOwner {
    require(token != address(0) && !acceptedTokens[token], "Invalid or already accepted token");
    acceptedTokens[token] = true;
    emit TokenAdded(token);
}

/**
 * @dev Removes an accepted ERC-20 token from the payment options.
 * Only the contract owner can call this function.
 * @param token Address of the token to be removed.
 */
function removeAcceptedToken(address token) external onlyOwner {
    require(acceptedTokens[token], "Token not accepted");
    delete acceptedTokens[token];
    emit TokenRemoved(token);
}

/**
 * @dev Internal function to process token payments.
 * @param token Address of the token being used for payment.
 * @param amount Amount of the token being transferred.
 */
function processPayment(address token, uint256 amount) internal {
    require(acceptedTokens[token], "Token not supported");
    require(amount > 0, "Invalid amount");
    require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Payment failed");
}

/**
 * @dev Allows users to buy airtime using an accepted token.
 * @param phoneNumber User's phone number.
 * @param amount Amount to be paid.
 * @param network Telecom network provider.
 * @param token ERC-20 token used for payment.
 */
function buyAirtime(string calldata phoneNumber, uint256 amount, string calldata network, address token) external {
    processPayment(token, amount);
    transactions[++transactionCounter] = Transaction(msg.sender, phoneNumber, amount, "airtime", network, "", "", block.timestamp, false, token);
    emit AirtimePurchase(msg.sender, phoneNumber, amount, network, token, block.timestamp);
}

/**
 * @dev Allows users to buy data using an accepted token.
 * @param phoneNumber User's phone number.
 * @param amount Amount to be paid.
 * @param network Telecom network provider.
 * @param dataPlan Data plan details.
 * @param token ERC-20 token used for payment.
 */
function buyData(string calldata phoneNumber, uint256 amount, string calldata network, string calldata dataPlan, address token) external {
    processPayment(token, amount);
    transactions[++transactionCounter] = Transaction(msg.sender, phoneNumber, amount, "data", network, dataPlan, "", block.timestamp, false, token);
    emit DataPurchase(msg.sender, phoneNumber, amount, network, dataPlan, token, block.timestamp);
}

/**
 * @dev Allows users to pay bills using an accepted token.
 * @param billType Type of bill being paid.
 * @param amount Amount to be paid.
 * @param accountNumber Account number linked to the bill.
 * @param token ERC-20 token used for payment.
 */
function payBill(string calldata billType, uint256 amount, string calldata accountNumber, address token) external {
    processPayment(token, amount);
    transactions[++transactionCounter] = Transaction(msg.sender, "", amount, "bill", "", "", billType, block.timestamp, false, token);
    emit BillPayment(msg.sender, billType, amount, accountNumber, token, block.timestamp);
}

/**
 * @dev Allows the contract owner to withdraw collected funds in a specified token.
 * @param token Address of the token being withdrawn.
 * @param amount Amount to be withdrawn.
 */
function withdrawFunds(address token, uint256 amount) external onlyOwner {
    require(acceptedTokens[token], "Token not supported");
    require(IERC20(token).transfer(msg.sender, amount), "Withdrawal failed");
    emit Withdrawal(msg.sender, token, amount, block.timestamp);
}

/**
 * @dev Fetches transaction details by ID.
 * @param transactionId ID of the transaction.
 * @return Transaction details.
 */
function getTransaction(uint256 transactionId) external view returns (Transaction memory) {
    return transactions[transactionId];
}

}