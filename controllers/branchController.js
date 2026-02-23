import Company from "../app/modules/Company/Companys.model.js";
import User from "../app/modules/User/Users.model.js";

export const getAllBranches = async (req, res) => {
  try {
    // Fetch distinct branch names from both collections
    const companyBranches = await Company.distinct("branch");
    const userBranches = await User.distinct("branch");

    // Merge and remove duplicates
    const uniqueBranches = [...new Set([...companyBranches, ...userBranches])];

    // Add a primary key (serial number) to each branch
    const branchList = uniqueBranches.map((branch, index) => ({
      id: index + 1, // Primary key (starting from 1)
      name: branch,
    }));

    res.status(200).json({ branches: branchList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
