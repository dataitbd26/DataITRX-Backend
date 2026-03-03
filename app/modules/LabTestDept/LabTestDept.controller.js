import LabTestDept from "./LabTestDept.model.js";

export async function getAllLabTestDepts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalDepts] = await Promise.all([
      LabTestDept.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      LabTestDept.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalDepts,
        totalPages: Math.ceil(totalDepts / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getLabTestDeptsBySearch(req, res) {
  const departmentName = req.params.departmentName;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { departmentName: { $regex: departmentName, $options: "i" } };

    const [result, totalDepts] = await Promise.all([
      LabTestDept.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      LabTestDept.countDocuments(query) 
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalDepts,
        totalPages: Math.ceil(totalDepts / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getLabTestDeptById(req, res) {
  const id = req.params.id;
  try {
    const result = await LabTestDept.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Department not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createLabTestDept(req, res) {
  try {
    const deptData = req.body;
    const result = await LabTestDept.create(deptData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateLabTestDept(req, res) {
  const id = req.params.id;
  const deptData = req.body;
  try {
    const result = await LabTestDept.findByIdAndUpdate(id, deptData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Department not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeLabTestDept(req, res) {
  const id = req.params.id;
  try {
    const result = await LabTestDept.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Department deleted successfully" });
    } else {
      res.status(404).json({ message: "Department not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}