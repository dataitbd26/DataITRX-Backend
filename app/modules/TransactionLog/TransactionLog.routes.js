import express from 'express';
import {
  getAllTransactionLogs,
  getPaginatedTransactionLogs,
  getTransactionLogsByBranch,
  getTransactionLogById,
  createTransactionLog,
  removeTransactionLog,
  // <-- import the new function
} from './TransactionLog.controller.js';

const router = express.Router();

// Existing routes
router.get('/all', getAllTransactionLogs);
router.get('/paginated', getPaginatedTransactionLogs);
router.get('/branch/:branch', getTransactionLogsByBranch);
router.get('/:id', getTransactionLogById);
router.post('/', createTransactionLog);
router.delete('/delete/:id', removeTransactionLog);

// NEW ROUTE: get distinct branches for dynamic dropdown


export default router;