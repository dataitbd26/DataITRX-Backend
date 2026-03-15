import Patient from "./Patients.model.js";

export async function getAllPatients(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalPatients] = await Promise.all([
            Patient.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Patient.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalPatients,
                totalPages: Math.ceil(totalPatients / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function getPatientsByBranch(req, res) {
    const branch = req.params.branch;

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const skip = (page - 1) * limit;

        const query = {
            branch,
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { bloodGroup: { $regex: search, $options: "i" } },
                { gender: { $regex: search, $options: "i" } }
            ]
        };

        const [result, totalPatients] = await Promise.all([
            Patient.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            Patient.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalPatients,
                totalPages: Math.ceil(totalPatients / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Get patient by ID
export async function getPatientById(req, res) {
    const id = req.params.id;
    try {
        const result = await Patient.findById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Patient not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Create a new patient
export async function createPatient(req, res) {
    try {
        const patientData = req.body;
        const result = await Patient.create(patientData);
        console.log("Patient created:", result);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Update a patient by ID
export async function updatePatient(req, res) {
    const id = req.params.id;
    const patientData = req.body;
    try {
        const result = await Patient.findByIdAndUpdate(id, patientData, {
            new: true,
        });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Patient not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Remove a patient by ID
export async function removePatient(req, res) {
    const id = req.params.id;
    try {
        const result = await Patient.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: "Patient deleted successfully" });
        } else {
            res.status(404).json({ message: "Patient not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}