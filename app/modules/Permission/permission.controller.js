import Permission from "./permission.model.js";

// --- GET Permissions for a Role ---
export async function getPermissionsByRole(req, res) {
  const { role } = req.params;

  try {
    // 1. Fetch raw permissions
    const permissions = await Permission.find({ role });

    // 2. Generate a simplified list of allowed group names
    const permissionReport = await Permission.aggregate([
      {
        $match: {
          role: role,
          isAllowed: true,
        },
      },
      {
        $group: {
          _id: null,
          allowedGroups: { $addToSet: "$group_name" },
        },
      },
      {
        $project: {
          _id: 0,
          allowedGroups: "$allowedGroups",
        },
      },
    ]);

    res.status(200).json({
      routesData: permissions,
      groupNames: permissionReport.length > 0 ? permissionReport[0] : { allowedGroups: [] },
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ error: "Failed to retrieve permissions" });
  }
}

// --- UPDATE (Upsert) Permission ---
export async function updatePermissions(req, res) {
  const routeData = req.body;

  // Validate required fields
  if (!routeData.role || !routeData.path) {
    return res.status(400).json({ error: "Missing required fields (role or path)" });
  }

  try {
    // ✅ OPTIMIZATION: Find and Update OR Create if not exists (Upsert)
    const updatedPermission = await Permission.findOneAndUpdate(
      { 
        role: routeData.role, 
        path: routeData.path 
      },
      { 
        $set: { 
            isAllowed: routeData.isAllowed,
            title: routeData.title,
            group_name: routeData.group_name
        } 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedPermission);
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({ error: error.message });
  }
}