import DoctorWebsite from "./DoctorWebsites.model.js";

export async function getAllDoctorWebsites(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            DoctorWebsite.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            DoctorWebsite.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit,
            },
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function getDoctorWebsitesByBranch(req, res) {
    const branch = req.params.branch;

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalItems] = await Promise.all([
            DoctorWebsite.find({ branch })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            DoctorWebsite.countDocuments({ branch }),
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit,
            },
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Get doctor website by ID
export async function getDoctorWebsiteById(req, res) {
    const id = req.params.id;

    try {
        const result = await DoctorWebsite.findById(id);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Doctor website not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Create a new doctor website
export async function createDoctorWebsite(req, res) {
    try {
        const doctorData = req.body;
        const result = await DoctorWebsite.create(doctorData);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Update a doctor website by ID
export async function updateDoctorWebsite(req, res) {
    const id = req.params.id;
    const doctorData = req.body;

    try {
        const result = await DoctorWebsite.findByIdAndUpdate(id, doctorData, {
            new: true,
        });

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Doctor website not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Remove a doctor website by ID
export async function removeDoctorWebsite(req, res) {
    const id = req.params.id;

    try {
        const result = await DoctorWebsite.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: "Doctor website deleted successfully" });
        } else {
            res.status(404).json({ message: "Doctor website not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}