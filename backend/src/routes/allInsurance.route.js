import express from 'express';
const router = express.Router();

import {
  createInsurance,
  getAllInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance
} from '../controllers/allInsurance.controller.js'; 

router.route('/').post(createInsurance);

router.route('/').get(getAllInsurances);

router.route('/:id').get(getInsuranceById);

router.route('/:id').patch(updateInsurance);

router.route('/:id').delete(deleteInsurance);

export default router;