import { Router } from 'express';
import { createRecord, deleteRecord, exportRecordsToExcel, getRecord, listRecords } from '../controllers/record.controller.js';

const router = Router();

router.get('/', listRecords);
router.get('/export/excel', exportRecordsToExcel);
router.get('/:id', getRecord);
router.post('/', createRecord);
router.delete('/:id', deleteRecord);

export default router;
