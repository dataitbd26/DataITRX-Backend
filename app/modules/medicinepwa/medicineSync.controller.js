import Medicine from "../Medicine/Medicine.model.js";

export async function bulkSyncMedicines(req, res) {
  try {
    const { after } = req.query;
    let filter = {};

    // DELTA SYNC LOGIC: If 'after' timestamp is provided, only fetch newer records
    if (after) {
      filter.updatedAt = { $gt: new Date(after) }; 
    }

    // STRIP THE FAT: Only select the exact fields Dexie needs for the search UI
    // .lean() makes the query insanely fast and uses 5x less server RAM
    const result = await Medicine.find(filter)
      .select('_id brandName genericName strength dosageType')
      .lean();
      console.log(result)

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}