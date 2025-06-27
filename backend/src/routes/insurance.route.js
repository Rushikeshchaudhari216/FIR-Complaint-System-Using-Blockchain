import { Router } from 'express';
import {   
  getInsuranceOptions,
  purchaseInsurance
} from '../controllers/insurance.controller.js';

const router = Router();

// Get insurance options for dropdown
router.get('/options', getInsuranceOptions);

// Purchase insurance (authenticated route)
router.post('/:insuranceId/purchase', purchaseInsurance);

export default router;