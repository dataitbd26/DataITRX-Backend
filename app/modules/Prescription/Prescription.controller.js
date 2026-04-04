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
        console.log("Fetched prescriptions:", result);

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
        const search = req.query.search;

        let query = { branch };

        if (search) {
            query.$or = [
                { 'patient.phone': { $regex: search, $options: 'i' } },
                { 'patient.name': { $regex: search, $options: 'i' } },
                { 'prescriptionId': { $regex: search, $options: 'i' } }
            ];
        }

        const [result, totalItems] = await Promise.all([
            Prescription.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            Prescription.countDocuments(query)
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
// Create prescription
// Get your imports correctly here based on your file structure
// import Prescription from './Prescription.model.js';
// import Patient from '../Patient/Patients.model.js';

export async function createPrescription(req, res) {
    try {
        const data = req.body;
        let resolvedPatientId = data.patient?.patientId;

        // If patientId is missing but we have patient data, verify or create
        if (!resolvedPatientId && data.patient) {
            // Destructure the actual fields from data.patient
            const { name, phone, email, age, gender } = data.patient;
            const branch = data.branch; 

            let existingPatient = null;

            // 1. Try to find by phone first (most accurate)
            if (phone) {
                existingPatient = await Patient.findOne({ phone, branch });
            }

            // 2. If no phone match, try to find by exact name match (case-insensitive)
            if (!existingPatient && name) {
                existingPatient = await Patient.findOne({ 
                    fullName: { $regex: new RegExp(`^${name}$`, 'i') },
                    branch 
                });
            }

            // 3. Set existing ID or Create new Patient
            if (existingPatient) {
                resolvedPatientId = existingPatient._id;
            } else {
                // Wait for the new patient to be created before moving on
                const newPatient = await Patient.create({
                    fullName: name, // assuming your DB schema uses "fullName"
                    phone: phone,
                    email: email,
                    age: age,
                    gender: gender,
                    branch: branch
                });
                resolvedPatientId = newPatient._id;
            }
        //    await newPatient.save(); // Ensure the new patient is saved before proceeding
        }

        // Attach the resolved patient ID to the prescription data payload
        const prescriptionPayload = {
            ...data,
            patientId: resolvedPatientId // Top-level reference
        };

        // If your schema stores the patient data as a nested object, ensure its ID is updated too
        if (prescriptionPayload.patient) {
            prescriptionPayload.patient.patientId = resolvedPatientId;
        }

        // Finally, create the prescription
        const result = await Prescription.create(prescriptionPayload);

        // console.log("Prescription created:", result);

        res.status(201).json(result);

    } catch (err) {
        console.error("Error creating prescription:", err);
        res.status(500).send({ error: err.message });
    }
};

// Update prescription
// Updated Update prescription controller
export async function updatePrescription(req, res) {
    const id = req.params.id;
    const data = req.body;

    try {
        // 1. Update the Prescription itself
        const result = await Prescription.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        // console.log("Prescription updated:", result);

        if (!result) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        // 2. Sync changes to the Patient document if patient info was provided
        if (data.patient && result.patientId) {
            const { name, phone, age, gender } = data.patient;
            
           let updatePatient = await Patient.findByIdAndUpdate(result.patientId, {
                fullName: name, // Matches your createPrescription logic
                phone: phone,
                age: age,
                gender: gender
            });
            
        //    console.log("Patient updated:", updatePatient);
        }

        res.status(200).json(result);

    } catch (err) {
        console.error("Error updating prescription:", err);
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