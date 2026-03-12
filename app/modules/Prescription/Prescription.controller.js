import Prescription from './Prescription.model.js';
import Patient from '../Patient/Patients.model.js';



// Get all prescriptions
export async function getAllPrescriptions(req, res) {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            Prescription.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            Prescription.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};



// Get prescriptions by branch
export async function getPrescriptionsByBranch(req, res) {

    const branch = req.params.branch;

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            Prescription.find({ branch })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            Prescription.countDocuments({ branch })
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


// Get prescription by ID
export async function getPrescriptionById(req, res) {

    const id = req.params.id;

    try {

        const result = await Prescription.findById(id);
 

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Prescription not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


// Create prescription
export async function createPrescription(req, res) {

    try {

        const data = req.body;

        const result = await Prescription.create(data);

        // console.log(result);

        res.status(201).json(result);

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


// Update prescription
export async function updatePrescription(req, res) {

    const id = req.params.id;
    const data = req.body;

    try {

        const result = await Prescription.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

    

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Prescription not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


// Delete prescription
export async function removePrescription(req, res) {

    const id = req.params.id;

    try {

        const result = await Prescription.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: "Prescription deleted successfully" });
        } else {
            res.status(404).json({ message: "Prescription not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};