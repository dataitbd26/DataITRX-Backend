import Labtest from "../Labtest/Labtests.model.js"; // Adjust path

export async function bulkSyncLabtests(req, res) {
  try {
    const { after } = req.query;
    let filter = { status: 'active' }; // Optional: Only sync active tests

    if (after) filter.updatedAt = { $gt: new Date(after) }; 

    // Strip the fat!
    const result = await Labtest.find(filter).select('_id testName status').lean();

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}