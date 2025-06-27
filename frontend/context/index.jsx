"use client";

import { ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { toast } from "sonner";
import {
  USER_REGISTRY_CONTRACT,
  USER_REGISTRY_ABI,
  COMPANY_REGISTRY_ABI,
  COMPANY_REGISTRY_CONTRACT,
  INSURANCE_CONTRACT,
  INSURANCE_ABI,
} from "./constants";

const ContractContext = createContext();

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
  const { isConnected, address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [isSepoliaNetwork, setIsSepoliaNetwork] = useState(false);

  const [userRegistry, setUserRegistry] = useState(null);
  const [companyRegistry, setCompanyRegistry] = useState(null);
  const [insuranceContract, setInsuranceContract] = useState(null);

  // User & Company status
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isCompanyRegistered, setIsCompanyRegistered] = useState(false);
  const [isCompanyVerified, setIsCompanyVerified] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Check if connected to Sepolia network
  useEffect(() => {
    if (chain) {
      const isSepolia = chain.id === 11155111;
      setIsSepoliaNetwork(isSepolia);

      if (!isSepolia && isConnected) {
        toast.warning("Please connect to Sepolia network");
      }
    }
  }, [chain, isConnected]);

  // Initialize contract instances when wallet is connected
  useEffect(() => {
    const initializeContracts = async () => {
      if (walletClient && isSepoliaNetwork) {
        try {
          // Create ethers signer from walletClient
          const provider = new ethers.providers.Web3Provider(walletClient);
          const signer = await provider.getSigner();

          // Initialize UserRegistry contract
          const userRegistryContract = new ethers.Contract(
            USER_REGISTRY_CONTRACT,
            USER_REGISTRY_ABI,
            signer
          );
          setUserRegistry(userRegistryContract);

          // Initialize CompanyRegistry contract
          const companyRegistryContract = new ethers.Contract(
            COMPANY_REGISTRY_CONTRACT,
            COMPANY_REGISTRY_ABI,
            signer
          );
          setCompanyRegistry(companyRegistryContract);

          // Initialize Insurance contract
          const insuranceContractInstance = new ethers.Contract(
            INSURANCE_CONTRACT,
            INSURANCE_ABI,
            signer
          );
          setInsuranceContract(insuranceContractInstance);
        } catch (error) {
          console.error("Error initializing contracts:", error);
          toast.error("Failed to initialize contracts");
        }
      }
    };

    if (isConnected) {
      initializeContracts();
    }
  }, [walletClient, isSepoliaNetwork, isConnected]);

  // Initialize read-only contract instances when wallet is not connected
  useEffect(() => {
    const initializeReadOnlyContracts = async () => {
      if (publicClient && !isConnected) {
        try {
          // Create read-only contracts using publicClient
          const userRegistryContract = {
            address: USER_REGISTRY_CONTRACT,
            abi: USER_REGISTRY_ABI,
            publicClient,
          };
          setUserRegistry(userRegistryContract);

          const companyRegistryContract = {
            address: COMPANY_REGISTRY_CONTRACT,
            abi: COMPANY_REGISTRY_ABI,
            publicClient,
          };
          setCompanyRegistry(companyRegistryContract);

          const insuranceContractInstance = {
            address: INSURANCE_CONTRACT,
            abi: INSURANCE_ABI,
            publicClient,
          };
          setInsuranceContract(insuranceContractInstance);
        } catch (error) {
          console.error("Error initializing read-only contracts:", error);
        }
      }
    };

    if (!isConnected) {
      initializeReadOnlyContracts();
    }
  }, [publicClient, isConnected]);

  // Check if the current user is registered when address or contract changes
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (userRegistry && address && isConnected) {
        try {
          const registered = await userRegistry.isUserRegistered(address);
          setIsUserRegistered(registered);
        } catch (error) {
          console.error("Error checking user registration:", error);
          setIsUserRegistered(false);
        }
      } else {
        setIsUserRegistered(false);
      }
    };

    checkUserRegistration();
  }, [userRegistry, address, isConnected]);

  // Check if the current address is a registered & verified company
  useEffect(() => {
    const checkCompanyStatus = async () => {
      if (companyRegistry && address && isConnected) {
        try {
          console.log("abc", companyRegistry);

          const company = await companyRegistry.companies(address);

          console.log("company", company);
          const isRegistered = company.registrationDate.toNumber() > 0;
          console.log("is registered", isRegistered);
          setIsCompanyRegistered(isRegistered);

          // Check if the company is verified
          if (isRegistered) {
            console.log("address", address);
            const verified = await companyRegistry.isCompanyVerified(address);
            console.log("verified fun", verified);

            setIsCompanyVerified(verified);
          } else {
            setIsCompanyVerified(false);
          }
          // Check if the current user is the owner
          const owner = await companyRegistry.owner();
          setIsOwner(owner.toLowerCase() === address.toLowerCase());
        } catch (error) {
          console.error("Error checking company status:", error);
          setIsCompanyRegistered(false);
          setIsCompanyVerified(false);
          setIsOwner(false);
        }
      } else {
        setIsCompanyRegistered(false);
        setIsCompanyVerified(false);
        setIsOwner(false);
      }
    };

    checkCompanyStatus();
  }, [companyRegistry, address, isConnected]);

  // Helper function to handle transaction errors
  const handleTxError = (error, message) => {
    console.error(message, error);

    // Extract a readable message from the error
    let errorMessage = "Transaction failed";

    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Show user-friendly error message
    toast.error(errorMessage);
    return null;
  };

  // ==================== USER REGISTRY FUNCTIONS ====================

  // Register a new user
  const registerUser = async (name, email, password) => {
    if (!userRegistry || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await userRegistry.registerUser(name, email, password);
      toast.loading("Registering user...");

      const receipt = await tx.wait();
      setIsUserRegistered(true);

      toast.dismiss();
      toast.success("Registration successful!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error registering user:");
    }
  };

  // Check if a specific address is registered
  const checkUserRegistration = async (userAddress) => {
    if (!userRegistry) return false;

    try {
      const addressToCheck = userAddress || address;
      if (!addressToCheck) return false;

      return await userRegistry.isUserRegistered(addressToCheck);
    } catch (error) {
      console.error("Error checking user registration:", error);
      return false;
    }
  };

  // Update user information
  const updateUserInfo = async (name, email) => {
    if (!userRegistry || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await userRegistry.updateUserInfo(name, email);
      toast.loading("Updating user info...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Profile updated successfully!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error updating user info:");
    }
  };

  // Update user password
  const updateUserPassword = async (newPassword) => {
    if (!userRegistry || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await userRegistry.updatePassword(newPassword);
      toast.loading("Updating password...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Password updated successfully!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error updating password:");
    }
  };

  // Verify user credentials using email and password
  const verifyUserCredentials = async (email, password) => {
    if (!userRegistry) {
      toast.error("Contract not initialized");
      return null;
    }

    try {
      const userAddress = await userRegistry.verifyCredentials(email, password);
      return userAddress !== ethers.constants.AddressZero ? userAddress : null;
    } catch (error) {
      console.error("Error verifying credentials:", error);
      toast.error("Failed to verify credentials");
      return null;
    }
  };

  // Get user address by email
  const getUserAddressByEmail = async (email) => {
    if (!userRegistry) return null;

    try {
      const userAddress = await userRegistry.getAddressByEmail(email);
      return userAddress !== ethers.constants.AddressZero ? userAddress : null;
    } catch (error) {
      console.error("Error getting address by email:", error);
      return null;
    }
  };

  // Get total number of registered users
  const getUserCount = async () => {
    if (!userRegistry) return 0;

    try {
      const count = await userRegistry.getUserCount();
      return parseInt(count.toString(), 10);
    } catch (error) {
      console.error("Error getting user count:", error);
      return 0;
    }
  };

  // Get user details by address
  const getUserDetails = async (userAddress) => {
    if (!userRegistry) return null;

    try {
      const addressToCheck = userAddress || address;
      if (!addressToCheck) return null;

      const user = await userRegistry.users(addressToCheck);

      // Format the response to a more JavaScript-friendly object
      return {
        name: user.name,
        email: user.email,
        isRegistered: user.isRegistered,
        registrationDate: new Date(user.registrationDate.toNumber() * 1000),
      };
    } catch (error) {
      console.error("Error getting user details:", error);
      return null;
    }
  };

  // ==================== END USER REGISTRY FUNCTIONS ====================

  // ==================== COMPANY REGISTRY FUNCTIONS ====================

  // Register a new company
  const registerCompany = async (
    name,
    email,
    companyCode,
    password,
    website,
    contactPhone
  ) => {
    if (!companyRegistry || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await companyRegistry.registerCompany(
        name,
        email,
        companyCode,
        password,
        website,
        contactPhone
      );

      toast.loading("Registering company...");

      const receipt = await tx.wait();
      setIsCompanyRegistered(true);

      toast.dismiss();
      toast.success("Company registration successful!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error registering company:");
    }
  };

  // Verify a company (only by platform owner)
  const verifyCompany = async (companyAddress) => {
    if (!companyRegistry || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await companyRegistry.verifyCompany(companyAddress);
      toast.loading("Verifying company...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Company verified successfully!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error verifying company:");
    }
  };

  // Update company information
  const updateCompanyInfo = async (name, email, website, contactPhone) => {
    if (!companyRegistry || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await companyRegistry.updateCompanyInfo(
        name,
        email,
        website,
        contactPhone
      );
      toast.loading("Updating company info...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Company profile updated successfully!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error updating company info:");
    }
  };

  // Update company password
  const updateCompanyPassword = async (currentPassword, newPassword) => {
    if (!companyRegistry || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const result = await companyRegistry.updatePassword(
        currentPassword,
        newPassword
      );

      if (result) {
        toast.success("Password updated successfully!");
        return true;
      } else {
        toast.error("Current password is incorrect");
        return false;
      }
    } catch (error) {
      return handleTxError(error, "Error updating company password:");
    }
  };

  // Check if a company is verified
  const checkCompanyVerification = async (companyAddress) => {
    if (!companyRegistry) return false;

    try {
      const addressToCheck = companyAddress || address;
      if (!addressToCheck) return false;

      return await companyRegistry.isCompanyVerified(addressToCheck);
    } catch (error) {
      console.error("Error checking company verification:", error);
      return false;
    }
  };

  // Get total number of registered companies
  const getCompanyCount = async () => {
    if (!companyRegistry) return 0;

    try {
      const count = await companyRegistry.getCompanyCount();
      return parseInt(count.toString(), 10);
    } catch (error) {
      console.error("Error getting company count:", error);
      return 0;
    }
  };

  // Verify company credentials using email and password
  const verifyCompanyCredentialsByEmail = async (email, password) => {
    if (!companyRegistry) {
      toast.error("Contract not initialized");
      return null;
    }

    try {
      const companyAddress = await companyRegistry.verifyCredentialsByEmail(
        email,
        password
      );
      return companyAddress !== ethers.constants.AddressZero
        ? companyAddress
        : null;
    } catch (error) {
      console.error("Error verifying company credentials:", error);
      toast.error("Failed to verify company credentials");
      return null;
    }
  };

  // Verify company credentials using company code and password
  const verifyCompanyCredentialsByCode = async (companyCode, password) => {
    if (!companyRegistry) {
      toast.error("Contract not initialized");
      return null;
    }

    try {
      const companyAddress =
        await companyRegistry.verifyCredentialsByCompanyCode(
          companyCode,
          password
        );
      return companyAddress !== ethers.constants.AddressZero
        ? companyAddress
        : null;
    } catch (error) {
      console.error("Error verifying company credentials:", error);
      toast.error("Failed to verify company credentials");
      return null;
    }
  };

  // Get company address by email
  const getCompanyAddressByEmail = async (email) => {
    if (!companyRegistry) return null;

    try {
      const companyAddress = await companyRegistry.getAddressByEmail(email);
      return companyAddress !== ethers.constants.AddressZero
        ? companyAddress
        : null;
    } catch (error) {
      console.error("Error getting company address by email:", error);
      return null;
    }
  };

  // Get company address by company code
  const getCompanyAddressByCode = async (companyCode) => {
    if (!companyRegistry) return null;

    try {
      const companyAddress = await companyRegistry.getAddressByCompanyCode(
        companyCode
      );
      return companyAddress !== ethers.constants.AddressZero
        ? companyAddress
        : null;
    } catch (error) {
      console.error("Error getting company address by code:", error);
      return null;
    }
  };

  // Get company details by address
  const getCompanyDetails = async (companyAddress) => {
    if (!companyRegistry) return null;

    try {
      const addressToCheck = companyAddress || address;
      if (!addressToCheck) return null;

      const company = await companyRegistry.companies(addressToCheck);

      // Format the response to a more JavaScript-friendly object
      return {
        name: company.name,
        email: company.email,
        companyCode: company.companyCode,
        adminAddress: company.adminAddress,
        isVerified: company.isVerified,
        registrationDate: new Date(company.registrationDate.toNumber() * 1000),
        website: company.website,
        contactPhone: company.contactPhone,
      };
    } catch (error) {
      console.error("Error getting company details:", error);
      return null;
    }
  };

  // Get all verified companies (for listing)
  const getAllCompanies = async () => {
    if (!companyRegistry) return [];

    try {
      const count = await companyRegistry.getCompanyCount();
      const companies = [];

      for (let i = 0; i < count; i++) {
        const companyAddress = await companyRegistry.companyAddresses(i);
        const company = await getCompanyDetails(companyAddress);

        if (company) {
          companies.push({
            address: companyAddress,
            ...company,
          });
        }
      }

      return companies;
    } catch (error) {
      console.error("Error getting all companies:", error);
      return [];
    }
  };

  // ==================== END COMPANY REGISTRY FUNCTIONS ====================

  // ==================== INSURANCE POLICY FUNCTIONS ====================

  // Create a new insurance policy
  const createPolicy = async (
    name,
    description,
    insuranceType,
    coverageAmount,
    waitingPeriodDays,
    durationDays,
    coverageScope
  ) => {
    if (
      !insuranceContract ||
      !isConnected ||
      !isSepoliaNetwork ||
      !isCompanyVerified
    ) {
      toast.error(
        "Please ensure you're connected to Sepolia network and your company is verified"
      );
      return null;
    }

    try {
      const tx = await insuranceContract.createPolicy(
        name,
        description,
        insuranceType, // Should be a number (0=Health, 1=Life, etc.)
        coverageAmount,
        waitingPeriodDays,
        durationDays,
        coverageScope
      );

      toast.loading("Creating insurance policy...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Insurance policy created successfully!");

      // Extract the policy ID from the event
      const event = receipt.events.find((e) => e.event === "PolicyCreated");
      const policyId = event ? event.args.policyId.toNumber() : null;

      return { receipt, policyId };
    } catch (error) {
      return handleTxError(error, "Error creating insurance policy:");
    }
  };

  // Update an existing insurance policy
  const updatePolicy = async (
    policyId,
    name,
    description,
    coverageAmount,
    waitingPeriodDays,
    durationDays,
    coverageScope
  ) => {
    if (!insuranceContract || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await insuranceContract.updatePolicy(
        policyId,
        name,
        description,
        coverageAmount,
        waitingPeriodDays,
        durationDays,
        coverageScope
      );

      toast.loading("Updating insurance policy...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Insurance policy updated successfully!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error updating insurance policy:");
    }
  };

  // Deactivate an insurance policy
  const deactivatePolicy = async (policyId) => {
    if (!insuranceContract || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await insuranceContract.deactivatePolicy(policyId);
      toast.loading("Deactivating insurance policy...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Insurance policy deactivated successfully!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error deactivating insurance policy:");
    }
  };

  // Purchase an insurance policy
  const purchasePolicy = async (policyId, premium) => {
    if (
      !insuranceContract ||
      !isConnected ||
      !isSepoliaNetwork ||
      !isUserRegistered
    ) {
      toast.error(
        "Please ensure you're connected to Sepolia network and registered as a user"
      );
      return null;
    }

    try {
      const tx = await insuranceContract.purchasePolicy(policyId, {
        value: ethers.utils.parseEther(premium.toString()),
      });

      toast.loading("Purchasing insurance policy...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Insurance policy purchased successfully!");

      // Extract the purchase ID from the event
      const event = receipt.events.find((e) => e.event === "PolicyPurchased");
      const purchaseId = event ? event.args.purchaseId.toNumber() : null;

      return { receipt, purchaseId };
    } catch (error) {
      return handleTxError(error, "Error purchasing insurance policy:");
    }
  };

  // Cancel a purchased policy
  const cancelPolicy = async (purchaseId) => {
    if (!insuranceContract || !isConnected || !isSepoliaNetwork) {
      toast.error("Please connect to Sepolia network");
      return null;
    }

    try {
      const tx = await insuranceContract.cancelPolicy(purchaseId);
      toast.loading("Cancelling insurance policy...");

      const receipt = await tx.wait();

      toast.dismiss();
      toast.success("Insurance policy cancelled successfully!");

      return receipt;
    } catch (error) {
      return handleTxError(error, "Error cancelling insurance policy:");
    }
  };

  // Get all policies created by a company
  const getCompanyPolicies = async (companyAddress) => {
    if (!insuranceContract) return [];

    try {
      const addressToCheck = companyAddress || address;
      if (!addressToCheck) return [];

      const policyIds = await insuranceContract.getCompanyPolicies(
        addressToCheck
      );
      const policies = [];

      for (const policyId of policyIds) {
        const policy = await getPolicyDetails(policyId.toNumber());
        if (policy) {
          policies.push(policy);
        }
      }

      return policies;
    } catch (error) {
      console.error("Error getting company policies:", error);
      return [];
    }
  };

  // Get all policies purchased by a user
  const getUserPurchases = async (userAddress) => {
    if (!insuranceContract) return [];

    try {
      const addressToCheck = userAddress || address;
      if (!addressToCheck) return [];

      const purchaseIds = await insuranceContract.getUserPurchases(
        addressToCheck
      );
      const purchases = [];

      for (const purchaseId of purchaseIds) {
        const purchase = await getPurchaseDetails(purchaseId.toNumber());
        if (purchase) {
          // Get policy details for this purchase
          const policy = await getPolicyDetails(purchase.policyId);

          purchases.push({
            ...purchase,
            policy,
          });
        }
      }

      return purchases;
    } catch (error) {
      console.error("Error getting user purchases:", error);
      return [];
    }
  };

  // Get policy details by ID
  const getPolicyDetails = async (policyId) => {
    if (!insuranceContract) return null;

    try {
      const policy = await insuranceContract.getPolicyDetails(policyId);

      // Format the response to a more JavaScript-friendly object
      return {
        policyId: policy.policyId.toNumber(),
        name: policy.name,
        description: policy.description,
        insuranceType: policy.insuranceType,
        companyAddress: policy.companyAddress,
        isActive: policy.isActive,
        coverageAmount: ethers.utils.formatEther(policy.coverageAmount),
        waitingPeriodDays: policy.waitingPeriodDays.toNumber(),
        durationDays: policy.durationDays.toNumber(),
        creationDate: new Date(policy.creationDate.toNumber() * 1000),
        coverageScope: policy.coverageScope,
      };
    } catch (error) {
      console.error("Error getting policy details:", error);
      return null;
    }
  };

  // Get purchase details by ID
  const getPurchaseDetails = async (purchaseId) => {
    if (!insuranceContract) return null;

    try {
      const purchase = await insuranceContract.getPurchaseDetails(purchaseId);

      // Format the response to a more JavaScript-friendly object
      return {
        purchaseId: purchaseId,
        policyId: purchase.policyId.toNumber(),
        userAddress: purchase.userAddress,
        purchaseDate: new Date(purchase.purchaseDate.toNumber() * 1000),
        startDate: new Date(purchase.startDate.toNumber() * 1000),
        endDate: new Date(purchase.endDate.toNumber() * 1000),
        status: ["Active", "Expired", "Cancelled"][purchase.status],
      };
    } catch (error) {
      console.error("Error getting purchase details:", error);
      return null;
    }
  };

  // Get all policies with pagination
  const getAllPolicies = async (startIndex = 0, count = 10) => {
    if (!insuranceContract) return [];

    try {
      const policyIds = await insuranceContract.getAllPolicies(
        startIndex,
        count
      );
      const policies = [];

      for (const policyId of policyIds) {
        const policy = await getPolicyDetails(policyId.toNumber());
        if (policy) {
          policies.push(policy);
        }
      }

      return policies;
    } catch (error) {
      console.error("Error getting all policies:", error);
      return [];
    }
  };

  // Get total policy count
  const getPolicyCount = async () => {
    if (!insuranceContract) return 0;

    try {
      const count = await insuranceContract.policyCount();
      return count.toNumber();
    } catch (error) {
      console.error("Error getting policy count:", error);
      return 0;
    }
  };

  // ==================== END INSURANCE POLICY FUNCTIONS ====================

  // Contract context value to be provided
  const contractValue = {
    isConnected,
    address,
    isSepoliaNetwork,
    userRegistry,
    companyRegistry,
    insuranceContract,

    // Status flags
    isUserRegistered,
    isCompanyRegistered,
    isCompanyVerified,
    isOwner,

    // User Registry Functions
    registerUser,
    checkUserRegistration,
    updateUserInfo,
    updateUserPassword: updateUserPassword,
    verifyUserCredentials,
    getUserAddressByEmail,
    getUserCount,
    getUserDetails,

    // Company Registry Functions
    registerCompany,
    verifyCompany,
    updateCompanyInfo,
    updateCompanyPassword,
    checkCompanyVerification,
    getCompanyCount,
    verifyCompanyCredentialsByEmail,
    verifyCompanyCredentialsByCode,
    getCompanyAddressByEmail,
    getCompanyAddressByCode,
    getCompanyDetails,
    getAllCompanies,

    // Insurance Policy Functions
    createPolicy,
    updatePolicy,
    deactivatePolicy,
    purchasePolicy,
    cancelPolicy,
    getCompanyPolicies,
    getUserPurchases,
    getPolicyDetails,
    getPurchaseDetails,
    getAllPolicies,
    getPolicyCount,
  };

  return (
    <ContractContext.Provider value={contractValue}>
      {children}
    </ContractContext.Provider>
  );
};
