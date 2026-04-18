import AppointmentBlock from "./AppointmentBlock.model.js";

export async function getAllAppointmentBlocks(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalAppointmentBlocks] = await Promise.all([
            AppointmentBlock.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            AppointmentBlock.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalAppointmentBlocks,
                totalPages: Math.ceil(totalAppointmentBlocks / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function getAppointmentBlocksByBranch(req, res) {
    const branch = req.params.branch;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [result, totalAppointmentBlocks] = await Promise.all([
            AppointmentBlock.find({ branch }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            AppointmentBlock.countDocuments({ branch })
        ]);

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                totalItems: totalAppointmentBlocks,
                totalPages: Math.ceil(totalAppointmentBlocks / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Get appointment block by ID
export async function getAppointmentBlockById(req, res) {
    const id = req.params.id;
    try {
        const result = await AppointmentBlock.findById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Appointment block not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Create a new appointment block
export async function createAppointmentBlock(req, res) {
    try {
        const appointmentBlockData = req.body;
        const result = await AppointmentBlock.create(appointmentBlockData);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Update an appointment block by ID
export async function updateAppointmentBlock(req, res) {
    const id = req.params.id;
    const appointmentBlockData = req.body;
    try {
        const result = await AppointmentBlock.findByIdAndUpdate(id, appointmentBlockData, {
            new: true,
        });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Appointment block not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Remove an appointment block by ID
export async function removeAppointmentBlock(req, res) {
    const id = req.params.id;
    try {
        const result = await AppointmentBlock.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: "Appointment block deleted successfully" });
        } else {
            res.status(404).json({ message: "Appointment block not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}