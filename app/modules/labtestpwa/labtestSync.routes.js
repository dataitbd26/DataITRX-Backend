 import express from 'express';
import { bulkSyncLabtests } from './labtestSync.controller.js';

const router = express.Router();

// GET Route for PWA Delta Sync (Lab Tests)
// Example: /api/labtestpwa/bulk-sync
router.get('/bulk-sync', bulkSyncLabtests);

export default router;