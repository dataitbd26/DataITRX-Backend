import PrescriptionTemplate from './PrescriptionTemplates.model.js';

// Get all templates
export async function getAllTemplates(req, res) {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            PrescriptionTemplate.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            PrescriptionTemplate.countDocuments()
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


// Get templates by branch
export async function getTemplatesByBranch(req, res) {

    const branch = req.params.branch;

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            PrescriptionTemplate.find({ branch })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            PrescriptionTemplate.countDocuments({ branch })
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


// Get template by ID
export async function getTemplateById(req, res) {

    const id = req.params.id;

    try {

        const result = await PrescriptionTemplate.findById(id);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Template not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


// Create template
export async function createTemplate(req, res) {

    try {

        const data = req.body;

        const result = await PrescriptionTemplate.create(data);

        res.status(201).json(result);

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


// Update template
export async function updateTemplate(req, res) {

    const id = req.params.id;
    const data = req.body;

    try {

        const result = await PrescriptionTemplate.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Template not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


// Delete template
export async function removeTemplate(req, res) {

    const id = req.params.id;

    try {

        const result = await PrescriptionTemplate.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: "Template deleted successfully" });
        } else {
            res.status(404).json({ message: "Template not found" });
        }

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};