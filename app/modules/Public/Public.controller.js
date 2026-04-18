import Prescription from '../Prescription/Prescription.model.js';
import DoctorProfile from '../DoctorProfile/DoctorProfiles.model.js';
import Chamber from '../Chamber/Chambers.model.js';

export async function getPublicPrescription(req, res) {
    const { id } = req.params;

    try {
        // Find prescription by its unique 8-digit prescriptionId, populate chamber info
        const prescription = await Prescription.findOne({ prescriptionId: id }).populate('chamberId');

        if (!prescription) {
            return res.status(404).json({ success: false, message: "Prescription not found or link is invalid." });
        }

        // Find the doctor profile associated with this prescription's branch
        const doctorProfile = await DoctorProfile.findOne({ branch: prescription.branch });

        res.status(200).json({
            success: true,
            prescription: prescription,
            doctorProfile: doctorProfile || null,
            chamber: prescription.chamberId || null
        });

    } catch (err) {
        console.error("Public API Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}
