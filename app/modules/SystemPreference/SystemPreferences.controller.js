import SystemPreference from "./SystemPreferences.model.js";


export async function getPreferenceByBranch(req, res) {
    const branch = req.params.branch;
    try {
        const result = await SystemPreference.findOne({ branch });

        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {

            res.status(200).json({
                success: true,
                data: {
                    timezone: "Asia/Dhaka",
                    printWithoutHeaderFooter: false,
                    autoSendEmail: false,
                    prescriptionHeaderSize: 150,
                    prescriptionFooterSize: 100
                }
            });
        }
    } catch (err) {
        res.status(500).send({ success: false, error: err.message });
    }
}


export async function upsertPreference(req, res) {
    const branch = req.params.branch;
    const preferenceData = req.body;

    try {

        const result = await SystemPreference.findOneAndUpdate(
            { branch: branch },
            { ...preferenceData, branch: branch },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, data: result, message: "Preferences saved successfully" });
    } catch (err) {
        res.status(500).send({ success: false, error: err.message });
    }
}

export async function getAllPreferences(req, res) {
    try {
        const result = await SystemPreference.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).send({ success: false, error: err.message });
    }
}