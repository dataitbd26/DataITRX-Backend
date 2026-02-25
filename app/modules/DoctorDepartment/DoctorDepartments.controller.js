import DoctorDepartment from "./DoctorDepartments.model.js";

export async function getAllDoctorDepartments(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalDoctorDepartments] = await Promise.all([
      DoctorDepartment.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      DoctorDepartment.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalDoctorDepartments,
        totalPages: Math.ceil(totalDoctorDepartments / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get doctor department by ID
export async function getDoctorDepartmentById(req, res) {
  const id = req.params.id;
  try {
    const result = await DoctorDepartment.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Doctor department not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Create a new doctor department
export async function createDoctorDepartment(req, res) {
  try {
    const doctorDepartmentData = req.body;
    const result = await DoctorDepartment.create(doctorDepartmentData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Update a doctor department by ID
export async function updateDoctorDepartment(req, res) {
  const id = req.params.id;
  const doctorDepartmentData = req.body;
  try {
    const result = await DoctorDepartment.findByIdAndUpdate(id, doctorDepartmentData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Doctor department not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a doctor department by ID
export async function removeDoctorDepartment(req, res) {
  const id = req.params.id;
  try {
    const result = await DoctorDepartment.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Doctor department deleted successfully" });
    } else {
      res.status(404).json({ message: "Doctor department not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}