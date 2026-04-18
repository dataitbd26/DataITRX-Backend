import PreCheckup from "./PreCheckups.model.js";
import Patient from "../Patient/Patients.model.js";

// Get all PreCheckups
export async function getAllPreCheckups(req, res) {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalItems] = await Promise.all([
      PreCheckup.find()
        .populate("patient")
        .populate("appointmentId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      PreCheckup.countDocuments(),
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


// Get PreCheckups by branch
export async function getPreCheckupsByBranch(req, res) {

  const branch = req.params.branch;

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalItems] = await Promise.all([

      PreCheckup.find({ branch })
        .populate("patient")
        .populate("appointmentId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      PreCheckup.countDocuments({ branch }),

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


// Get PreCheckup by ID
export async function getPreCheckupById(req, res) {

  const id = req.params.id;

  try {

    const result = await PreCheckup.findById(id)
        .populate("patient")
        .populate("appointmentId");

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "PreCheckup not found" });
    }

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


import Appointment from "../Appointment/Appointments.model.js";

// Create PreCheckup
export async function createPreCheckup(req, res) {
  try {
    const data = req.body;
    const result = await PreCheckup.create(data);

    if (data.appointmentId) {
       await Appointment.findByIdAndUpdate(data.appointmentId, { preCheckupId: result._id });
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


// Update PreCheckup
export async function updatePreCheckup(req, res) {

  const id = req.params.id;
  const data = req.body;

  try {

    const result = await PreCheckup.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "PreCheckup not found" });
    }

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


// Delete PreCheckup
export async function removePreCheckup(req, res) {
  const id = req.params.id;
  try {
    const result = await PreCheckup.findByIdAndDelete(id);

    if (result) {
      if (result.appointmentId) {
         await Appointment.findByIdAndUpdate(result.appointmentId, { preCheckupId: null });
      }
      res.status(200).json({ message: "PreCheckup deleted successfully" });
    } else {
      res.status(404).json({ message: "PreCheckup not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


// Create Patient + PreCheckup together
export async function createPatientWithPreCheckup(req, res) {

  try {

    const { patient, preCheckup } = req.body;

    const patientResult = await Patient.create(patient);

    const preCheckupData = {
      ...preCheckup,
      patient: patientResult._id,
    };

    const preCheckupResult = await PreCheckup.create(preCheckupData);

    res.status(201).json({
      patient: patientResult,
      preCheckup: preCheckupResult,
    });

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}