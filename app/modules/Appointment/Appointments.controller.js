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

    const query = { branch };

    // 1. Chamber Filter
    if (req.query.chamberId) {
      query.chamberId = req.query.chamberId;
    }

    // 2. Date Filter (Match any time within the requested day)
    if (req.query.date) {
      const targetDate = new Date(req.query.date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // 3. Pre-Checkup Status Filter
    if (req.query.status === 'Completed') {
      query.preCheckupId = { $ne: null }; 
    } else if (req.query.status === 'Pending') {
      query.preCheckupId = null; 
    }

    // 4. Patient Info Filter (Search & Gender)
    if (req.query.search || (req.query.gender && req.query.gender !== '')) {
      const patientQuery = { branch }; 
      
      if (req.query.gender) {
        patientQuery.gender = req.query.gender;
      }

      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        patientQuery.$or = [
          { fullName: searchRegex },
          { phone: searchRegex }
        ];
      }

      const matchedPatients = await Patient.find(patientQuery).select('_id');
      const patientIds = matchedPatients.map(p => p._id);
      
      if (patientIds.length === 0) {
         return res.status(200).json({
           success: true,
           data: [],
           pagination: { totalItems: 0, totalPages: 0, currentPage: page, itemsPerPage: limit }
         });
      }
      
      query.patientId = { $in: patientIds };
    }

    const [result, totalAppointments] = await Promise.all([
      Appointment.find(query)
        .populate("patientId")
        .populate("chamberId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Appointment.countDocuments(query) 
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
    console.log(result);
    if (result) {
      res.status(200).json({ message: "Appointment deleted successfully" });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}