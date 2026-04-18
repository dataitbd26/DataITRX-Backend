import PrescriptionTemplate from "./PrescriptionTemplates.model.js";

export async function getAllPrescriptionTemplates(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            PrescriptionTemplate.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            PrescriptionTemplate.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function getPrescriptionTemplatesByDoctor(req, res) {
    const doctorId = req.params.doctorId;

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            PrescriptionTemplate.find({ doctorId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            PrescriptionTemplate.countDocuments({ doctorId })
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Get template by ID
export async function getPrescriptionTemplateById(req, res) {
    const id = req.params.id;

    try {
        const result = await PrescriptionTemplate.findById(id);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Prescription template not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Create a new template
export async function createPrescriptionTemplate(req, res) {
    try {
        const templateData = req.body;

        const result = await PrescriptionTemplate.create(templateData);

        res.status(201).json(result);

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Update template by ID
export async function updatePrescriptionTemplate(req, res) {
    const id = req.params.id;
    const templateData = req.body;

    try {
        const result = await PrescriptionTemplate.findByIdAndUpdate(id, templateData, {
            new: true,
        });

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Prescription template not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Delete template
export async function removePrescriptionTemplate(req, res) {
    const id = req.params.id;

    try {
        const result = await PrescriptionTemplate.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: "Prescription template deleted successfully" });
        } else {
            res.status(404).json({ message: "Prescription template not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}