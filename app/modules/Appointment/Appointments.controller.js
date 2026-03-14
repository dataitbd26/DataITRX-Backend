import Appointment from "./Appointments.model.js";
import Patient from "../Patient/Patients.model.js";
import Chamber from "../Chamber/Chambers.model.js";

export async function getAllAppointments(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalAppointments] = await Promise.all([
      Appointment.find()
        .populate("patientId")
        .populate("chamberId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Appointment.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalAppointments,
        totalPages: Math.ceil(totalAppointments / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAppointmentsByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1. Build a dynamic query object
    const query = { branch };

    // 2. Check if chamberId is in the query params and add it to the filter
    if (req.query.chamberId) {
      query.chamberId = req.query.chamberId;
    }

    // Optional: If you also want to support the date and search filters you have in your React component:
    if (req.query.date) {
      // Assuming appointmentDate in DB is stored as a Date string (YYYY-MM-DD)
      // Note: If you store exact timestamps, you might need a $gte / $lte date range query here
      query.appointmentDate = new Date(req.query.date);
    }

    if (req.query.search) {
      // Just an example of how you'd hook up that search bar!
      // This requires searching through populated patient data, which usually 
      // requires an aggregate or a two-step query in MongoDB.
    }

    // 3. Pass the dynamic 'query' object into the find() and countDocuments() methods
    const [result, totalAppointments] = await Promise.all([
      Appointment.find(query)
        .populate("patientId")
        .populate("chamberId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Appointment.countDocuments(query) // Use the same query here!
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalAppointments,
        totalPages: Math.ceil(totalAppointments / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAppointmentById(req, res) {
  const id = req.params.id;
  try {
    const result = await Appointment.findById(id)
      .populate("patientId")
      .populate("chamberId");

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createAppointment(req, res) {
  try {
    const {
      patientDetails,
      patientId,
      chamberId,
      appointmentDate,
      appointmentTime,
      patientType,
      branch
    } = req.body;

    let finalPatientId = patientId;

    if (patientDetails) {
      const newPatient = await Patient.create({ ...patientDetails, branch });
      finalPatientId = newPatient._id;
    }

    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const datePrefix = `${yy}${mm}${dd}`;

    const chambersInBranch = await Chamber.find({ branch }).sort({ createdAt: 1 });
    const chamberIndex = chambersInBranch.findIndex((c) => c._id.toString() === chamberId.toString()) + 1;
    const chamberNumber = chamberIndex > 0 ? chamberIndex : 1;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const lastAppointment = await Appointment.findOne({
      chamberId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ serial: -1 });

    const nextSerial = lastAppointment && lastAppointment.serial ? lastAppointment.serial + 1 : 1;
    const generatedAppointmentId = `${datePrefix}${chamberNumber}${nextSerial}`;

    const appointmentData = {
      appointmentId: generatedAppointmentId,
      preCheckupId: null,
      patientId: finalPatientId,
      chamberId,
      serial: nextSerial,
      appointmentDate,
      appointmentTime,
      patientType,
      branch
    };

    const result = await Appointment.create(appointmentData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateAppointment(req, res) {
  const id = req.params.id;
  const appointmentData = req.body;
  try {
    const result = await Appointment.findByIdAndUpdate(id, appointmentData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeAppointment(req, res) {
  const id = req.params.id;
  try {
    const result = await Appointment.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Appointment deleted successfully" });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}