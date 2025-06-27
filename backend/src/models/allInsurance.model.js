import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Insurance name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  coverageAmount: {
    type: Number,
    required: [true, 'Coverage amount is required'],
    min: [100, 'Minimum coverage amount is 100']
  },
  premium: {
    type: Number,
    required: [true, 'Premium amount is required'],
    min: [1, 'Minimum premium is 1']
  },
  deductible: {
    type: Number,
    required: [true, 'Deductible amount is required'],
    min: [0, 'Deductible cannot be negative']
  },
  effectiveDate: {
    type: Date,
    required: [true, 'Effective date is required'],
    validate: {
      validator: function(value) {
        return value < this.expiryDate;
      },
      message: 'Effective date must be before expiry date'
    }
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  coverageDetails: {
    type: String,
    required: [true, 'Coverage details are required'],
    maxlength: [1000, 'Details cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search capabilities
insuranceSchema.index({
  name: 'text',
  coverageDetails: 'text'
});

const AllInsurance = mongoose.model('AllInsurance', insuranceSchema); // Changed model name here
export { AllInsurance };