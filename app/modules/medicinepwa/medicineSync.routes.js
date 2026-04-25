import express from 'express';
import { bulkSyncMedicines } from './medicineSync.controller.js';


const router = express.Router();

router.get('/bulk-sync', bulkSyncMedicines);



export default router;