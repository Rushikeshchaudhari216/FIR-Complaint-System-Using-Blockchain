// models/purchase.model.js
import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  insurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AllInsurance',
    required: true
  },
  selectedPeriod: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  calculatedPremium: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

export const Purchase = mongoose.model('Purchase', purchaseSchema);