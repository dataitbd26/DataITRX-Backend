import DoctorProfile from "./DoctorProfiles.model.js";

export async function getAllDoctorProfiles(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalDoctorProfiles] = await Promise.all([
      DoctorProfile.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      DoctorProfile.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalDoctorProfiles,
        totalPages: Math.ceil(totalDoctorProfiles / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getDoctorProfilesByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalDoctorProfiles] = await Promise.all([
      DoctorProfile.find({ branch }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      DoctorProfile.countDocuments({ branch }) 
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalDoctorProfiles,
        totalPages: Math.ceil(totalDoctorProfiles / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get doctor profile by ID
export async function getDoctorProfileById(req, res) {
  const id = req.params.id;
  try {
    const result = await DoctorProfile.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Doctor profile not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Create a new doctor profile
export async function createDoctorProfile(req, res) {
  try {
    const doctorProfileData = req.body;
    const result = await DoctorProfile.create(doctorProfileData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Update a doctor profile by ID
export async function updateDoctorProfile(req, res) {
  const id = req.params.id;
  const doctorProfileData = req.body;
  try {
    const result = await DoctorProfile.findByIdAndUpdate(id, doctorProfileData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Doctor profile not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a doctor profile by ID
export async function removeDoctorProfile(req, res) {
  const id = req.params.id;
  try {
    const result = await DoctorProfile.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Doctor profile deleted successfully" });
    } else {
      res.status(404).json({ message: "Doctor profile not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}