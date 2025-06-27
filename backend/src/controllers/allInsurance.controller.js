import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AllInsurance } from "../models/allInsurance.model.js"; 
import mongoose from "mongoose";

// Create Insurance
const createInsurance = asyncHandler(async (req, res) => {
  const {
    name,
    coverageAmount,
    premium,
    deductible,
    effectiveDate,
    expiryDate,
    coverageDetails
  } = req.body;

  // Validation
  if (
    [name, coverageAmount, premium, deductible, effectiveDate, expiryDate, coverageDetails]
      .some(field => field === undefined || field === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Date validation
  if (new Date(effectiveDate) >= new Date(expiryDate)) {
    throw new ApiError(400, "Effective date must be before expiry date");
  }

  try {
    const insurance = await AllInsurance.create({ // Using AllInsurance here
      name: name.trim(),
      coverageAmount,
      premium,
      deductible,
      effectiveDate: new Date(effectiveDate),
      expiryDate: new Date(expiryDate),
      coverageDetails: coverageDetails.trim()
    });

    return res.status(201).json(
      new ApiResponse(201, insurance, "Insurance policy created successfully")
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Insurance name already exists");
    }
    throw new ApiError(500, "Failed to create insurance policy");
  }
});

// Get All Insurances
const getAllInsurances = asyncHandler(async (req, res) => {
  try {
    const { search, sort } = req.query;
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    const sortOptions = {};
    if (sort) {
      sort.split(',').forEach(sortOption => {
        const [field, order] = sortOption.split(':');
        sortOptions[field] = order === 'desc' ? -1 : 1;
      });
    }

    const insurances = await AllInsurance.find(filter) // Using AllInsurance here
      .sort(sortOptions)
      .collation({ locale: 'en', strength: 2 });

    return res.status(200).json(
      new ApiResponse(200, insurances, "Insurance policies retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve insurance policies");
  }
});

// Get Single Insurance
const getInsuranceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid insurance ID");
  }

  try {
    const insurance = await AllInsurance.findById(id); // Using AllInsurance here

    if (!insurance) {
      throw new ApiError(404, "Insurance policy not found");
    }

    return res.status(200).json(
      new ApiResponse(200, insurance, "Insurance policy retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve insurance policy");
  }
});

// Update Insurance
const updateInsurance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid insurance ID");
  }

  const allowedUpdates = [
    'name',
    'coverageAmount',
    'premium',
    'deductible',
    'effectiveDate',
    'expiryDate',
    'coverageDetails'
  ];

  const invalidUpdates = Object.keys(updates).filter(
    update => !allowedUpdates.includes(update)
  );

  if (invalidUpdates.length > 0) {
    throw new ApiError(400, `Invalid fields: ${invalidUpdates.join(', ')}`);
  }

  try {
    // Date validation if dates are updated
    if (updates.effectiveDate || updates.expiryDate) {
      const effective = updates.effectiveDate ? new Date(updates.effectiveDate) : null;
      const expiry = updates.expiryDate ? new Date(updates.expiryDate) : null;

      if (effective && expiry && effective >= expiry) {
        throw new ApiError(400, "Effective date must be before expiry date");
      }
    }

    const insurance = await AllInsurance.findByIdAndUpdate( // Using AllInsurance here
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!insurance) {
      throw new ApiError(404, "Insurance policy not found");
    }

    return res.status(200).json(
      new ApiResponse(200, insurance, "Insurance policy updated successfully")
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Insurance name already exists");
    }
    throw error;
  }
});

// Delete Insurance
const deleteInsurance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid insurance ID");
  }

  try {
    const insurance = await AllInsurance.findByIdAndDelete(id); // Using AllInsurance here

    if (!insurance) {
      throw new ApiError(404, "Insurance policy not found");
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Insurance policy deleted successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to delete insurance policy");
  }
});

export {
  createInsurance,
  getAllInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance
};