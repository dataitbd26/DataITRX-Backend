import Appointment from "./Appointments.model.js";
import Patient from "../Patient/Patients.model.js";
import Chamber from "../Chamber/Chambers.model.js";
import Prescription from "../Prescription/Prescription.model.js";
import PreCheckup from "../PreCheckups/PreCheckups.model.js";

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

    if (req.query.chamberId) {
      query.chamberId = req.query.chamberId;
    }

    if (req.query.date) {
      query.appointmentDate = new Date(req.query.date);
    }

    if (req.query.status === 'Completed') {
      query.preCheckupId = { $ne: null };
    } else if (req.query.status === 'Pending') {
      query.preCheckupId = null;
    }

    if (req.query.patientType) {
      query.patientType = req.query.patientType;
    }

    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      
      // Step 1: Find matching patients
      const matchingPatients = await Patient.find({
        $or: [
          { fullName: searchRegex },
          { phone: searchRegex }
        ]
      }).select('_id');
      const patientIds = matchingPatients.map(p => p._id);
      
      // Step 2: Query appointments matching patient IDs OR exactly matching appointment ID
      query.$or = [
        { patientId: { $in: patientIds } },
        { appointmentId: searchRegex }
      ];
    } else if (req.query.gender) {
      const patientQuery = { gender: req.query.gender };
      const matchingPatients = await Patient.find(patientQuery).select('_id');
      const patientIds = matchingPatients.map(p => p._id);
      query.patientId = { $in: patientIds };
    }

    const [rawResult, totalAppointments] = await Promise.all([
      Appointment.find(query)
        .populate("patientId")
        .populate("chamberId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Appointment.countDocuments(query)
    ]);

    // Calculate Dynamic Prescription Status
    const result = await Promise.all(rawResult.map(async (appt) => {
        const apptObj = appt.toObject();
        
        if (!appt.patientId || !appt.chamberId) {
            apptObj.isPrescription = 'No';
            return apptObj;
        }

        const apptDate = new Date(appt.appointmentDate);
        const startOfDay = new Date(apptDate).setHours(0, 0, 0, 0);
        const endOfDay = new Date(apptDate).setHours(23, 59, 59, 999);

        const prescriptionExists = await Prescription.exists({
            patientId: appt.patientId._id,
            createdAt: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) }
        });

        apptObj.isPrescription = prescriptionExists ? 'Yes' : 'No';
        return apptObj;
    }));

    // Post-computation manual filter for isPrescription
    let finalData = result;
    if (req.query.isPrescription) {
        finalData = result.filter(r => r.isPrescription === req.query.isPrescription);
    }

    res.status(200).json({
      success: true,
      data: finalData,
      pagination: {
        totalItems: req.query.isPrescription ? finalData.length : totalAppointments,
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
      .populate("chamberId")
      .populate("preCheckupId");

      // console.log("Fetched Appointment:", result); // Debug log

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
      // Date formatting fix added here
      if (patientDetails.dateOfBirth && patientDetails.dateOfBirth.includes('/')) {
        const [day, month, year] = patientDetails.dateOfBirth.split('/');
        patientDetails.dateOfBirth = `${year}-${month}-${day}`; 
      }
      
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