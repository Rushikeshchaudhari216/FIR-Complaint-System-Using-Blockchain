import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Insurance name is required'],
    unique: true,
    trim: true
  },
  coverageAmount: {
    type: Number,
    required: [true, 'Coverage amount per year is required'],
    min: [0.1, 'Minimum coverage amount is 0.1']
  },
  periodOptions: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v.every(year => [1, 2, 3].includes(year));
      },
      message: 'Period options must be 1, 2, or 3 years'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const AllInsurance = mongoose.model('AllInsurance', insuranceSchema);
export { AllInsurance };