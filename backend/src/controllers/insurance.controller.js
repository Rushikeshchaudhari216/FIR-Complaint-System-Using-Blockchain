import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { AllInsurance  } from '../models/allInsurance.model.js';
import { Purchase } from '../models/purchase.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

// Get all insurance options for dropdown
const getInsuranceOptions = asyncHandler(async (req, res) => {
  const insurances = await AllInsurance.find({}, 'name coverageAmount periodOptions');
  return res.status(200).json(
    new ApiResponse(200, insurances, 'Insurance options retrieved successfully')
  );
});

// Purchase insurance
const purchaseInsurance = asyncHandler(async (req, res) => {
  const { insuranceId } = req.params;
  const { selectedPeriod, userId } = req.body; // Get user ID from request body

  // Validate inputs
  if (!mongoose.Types.ObjectId.isValid(insuranceId)) {
    throw new ApiError(400, 'Invalid insurance ID');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  if (![1, 2, 3].includes(selectedPeriod)) {
    throw new ApiError(400, 'Invalid period selection');
  }

  // Verify user exists
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new ApiError(404, 'User not found');
  }

  // Get insurance details
  const insurance = await AllInsurance.findById(insuranceId);
  if (!insurance) {
    throw new ApiError(404, 'Insurance plan not found');
  }

  // Create purchase record
  const purchase = await Purchase.create({
    user: userId, // Directly use provided user ID
    insurance: insuranceId,
    selectedPeriod,
    calculatedPremium: insurance.coverageAmount * selectedPeriod
  });

  return res.status(201).json(
    new ApiResponse(201, {
      purchaseId: purchase._id,
      userId,
      insuranceId,
      totalPremium: purchase.calculatedPremium
    }, 'Insurance purchased successfully')
  );
});

export {
  getInsuranceOptions,
  purchaseInsurance
};