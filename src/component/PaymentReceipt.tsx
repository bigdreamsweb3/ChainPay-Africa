import type React from "react";
import { CheckCircle, ExternalLink, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
// 
interface PaymentReceiptProps {
  transactionId: string;
  serviceType: string;
  amount: string;
  paymentToken: string;
  recipientInfo: string;
  timestamp: string;
  blockchainTxHash: string;
  blockNumber: number;
  gasUsed: string;
  walletAddress: string; // New prop for wallet address
  onReset: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  transactionId,
  serviceType,
  amount,
  paymentToken,
  recipientInfo,
  timestamp,
  blockchainTxHash,
  blockNumber,
  gasUsed,
  walletAddress,
  onReset,
}) => {
  const { chain } = useAccount();

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <CheckCircle className="text-green-500 w-12 h-12" />
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          Payment Successful
        </h2>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4 text-sm text-gray-700">
        {/* Wallet Address */}
        <div className="flex justify-between items-center">
          <span className="font-medium flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet:
          </span>
          <span className="font-mono text-gray-600">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>

        {/* Transaction ID */}
        <div className="flex justify-between">
          <span className="font-medium">Transaction ID:</span>
          <span>{transactionId}</span>
        </div>

        {/* Service */}
        <div className="flex justify-between">
          <span className="font-medium">Service:</span>
          <span className="capitalize">{serviceType}</span>
        </div>

        {/* Amount */}
        <div className="flex justify-between">
          <span className="font-medium">Amount:</span>
          <span>
            {amount} {paymentToken}
          </span>
        </div>

        {/* Recipient */}
        <div className="flex justify-between">
          <span className="font-medium">Recipient:</span>
          <span>{recipientInfo}</span>
        </div>

        {/* Date & Time */}
        <div className="flex justify-between">
          <span className="font-medium">Date & Time:</span>
          <span>{timestamp}</span>
        </div>

        {/* Blockchain Transaction */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Blockchain Tx:</span>
          <a
            href={`${chain?.blockExplorers?.default.url}/${blockchainTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            {blockchainTxHash.slice(0, 6)}...{blockchainTxHash.slice(-4)}
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Block Number */}
        <div className="flex justify-between">
          <span className="font-medium">Block Number:</span>
          <span>{blockNumber}</span>
        </div>

        {/* Gas Used */}
        <div className="flex justify-between">
          <span className="font-medium">Gas Used:</span>
          <span>
            {gasUsed} {paymentToken}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Thank you for your payment. Please keep this receipt for your records.
        </p>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Make Another Payment
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentReceipt;
