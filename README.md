# 🛡️ Decentralized Health Insurance Platform

A decentralized application (DApp) providing blockchain-powered health insurance services. The project leverages smart contracts to ensure trustless user registration and insurance policy management on the Ethereum test network.

## 📌 Overview

This DApp aims to bring transparency and automation to the health insurance process using Ethereum smart contracts. The project consists of two main parts:

- **Frontend:** Built with Vite + React + TypeScript, TailwindCSS, and ShadCN UI.
- **Smart Contracts:** Written in Solidity, deployed to the Ethereum testnet.

---

## 🧠 Core Concepts

- **Smart Contracts for Authentication & Insurance**
  - `AuthContract`: Manages user login and registration on-chain.
  - `InsuranceContract`: Handles insurance policy creation and transactions.
- **Web3 Integration** using `ethers.js` and MetaMask.
- **Test Network**: Ropsten, Goerli, or Sepolia (configurable).
- **Secure Transactions** with real-time on-chain state sync.

---

## 🛠️ Tech Stack

### Frontend
- **React + Vite + TypeScript**
- **TailwindCSS + ShadCN UI + Radix UI**
- **React Router DOM** (Routing)
- **Zod + React Hook Form** (Validation)
- **TanStack React Query** (Data fetching)
- **Recharts** (Data visualization)
- **MetaMask Integration**

### Smart Contracts
- **Solidity**
- **Hardhat** (or Truffle)
- **Ethereum Testnet Deployment**
- **OpenZeppelin Contracts**

---

## 📁 Project Structure

├── client/ # Frontend (Vite + React + TypeScript) │ ├── components/ # UI Components using ShadCN & Radix │ ├── pages/ # Route-based pages (Home, Login, Insurance) │ ├── utils/ # MetaMask & Ethers helpers │ └── App.tsx # App entry point ├── contracts/ # Solidity smart contracts │ ├── AuthContract.sol # Registration/Login logic │ └── InsuranceContract.sol # Health insurance logic ├── scripts/ # Deployment & verification scripts └── README.md # Project overview
