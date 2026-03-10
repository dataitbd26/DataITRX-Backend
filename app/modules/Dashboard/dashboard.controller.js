import Chamber from "../Chamber/Chambers.model.js";
import Patient from "../Patient/Patients.model.js";
import Prescription from "../Prescription/Prescription.model.js";
import User from "../User/Users.model.js";
import Medicine from "../Medicine/Medicine.model.js";
import TransactionLog from "../TransactionLog/TransactionLog.model.js";
import DoctorProfile from "../DoctorProfile/DoctorProfiles.model.js";
import UserLog from "../UserLog/UserLog.model.js";
import Labtest from "../Labtest/Labtests.model.js";
import LabTestDept from "../LabTestDept/LabTestDept.model.js";
import moment from "moment";

export const getSuperAdminDashboard = async (req, res) => {
  try {
    // 1. Setup Date Boundaries
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const { startDate, endDate } = req.query;
    let dateFilter = {};
    let transactionDateFilter = {};

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
      transactionDateFilter.transactionTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Run all heavy DB queries concurrently
    const [
      // --- Global Counts ---
      totalPatients,
      totalPrescriptions,
      totalDoctors,
      totalUsers,
      totalChambers,
      totalMedicines,
      totalLabTests,
      totalLabDepts,
      globalRevenueResult,

      // --- Pending / Inactive Counts (The new requirements) ---
      inactiveLabTests,
      pendingMedicines,
      inactiveUsers,
      draftPrescriptions,

      // --- TODAY'S ACTIVITY ---
      todaysRevenueData,
      todaysFailedTransactions,
      todaysLogins,
      newPatientsToday,
      todaysPrescriptions,

      // --- THIS MONTH'S ACTIVITY ---
      thisMonthRevenueData,
      thisMonthFailedTransactions,
      thisMonthLogins,
      newPatientsThisMonth,
      thisMonthPrescriptions,

      // --- Graphs Analytics ---
      prescriptionStatusStats,
      prescriptionsOverTime,
      patientGenderStats,

      // --- Recent Tables ---
      recentPrescriptions,
      recentTransactions,
      recentLogins,
    ] = await Promise.all([
      // 1. Global Counts
      Patient.countDocuments(dateFilter),
      Prescription.countDocuments(dateFilter),
      DoctorProfile.countDocuments(dateFilter),
      User.countDocuments(dateFilter),
      Chamber.countDocuments(dateFilter),
      Medicine.countDocuments(dateFilter),
      Labtest.countDocuments(dateFilter),
      LabTestDept.countDocuments(dateFilter),
      TransactionLog.aggregate([
        { $match: { status: "success", ...transactionDateFilter } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
      ]),

      // 2. Pending / Inactive Counts
      Labtest.countDocuments({ ...dateFilter, status: { $ne: "active" } }), // Not active
      Medicine.countDocuments({ ...dateFilter, status: { $ne: "final" } }), // Not final
      User.countDocuments({ ...dateFilter, status: { $ne: "active" } }),    // Not active
      Prescription.countDocuments({ ...dateFilter, status: "Draft" }),      // Draft Prescriptions (Makes 4 items)

      // 3. Today's Activity
      TransactionLog.aggregate([
        { $match: { status: "success", transactionTime: { $gte: startOfDay, $lte: endOfDay } } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
      ]),
      TransactionLog.countDocuments({ status: "failed", transactionTime: { $gte: startOfDay, $lte: endOfDay } }),
      UserLog.countDocuments({ loginTime: { $gte: startOfDay, $lte: endOfDay } }),
      Patient.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
      Prescription.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),

      // 4. This Month's Activity
      TransactionLog.aggregate([
        { $match: { status: "success", transactionTime: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
      ]),
      TransactionLog.countDocuments({ status: "failed", transactionTime: { $gte: startOfMonth, $lte: endOfMonth } }),
      UserLog.countDocuments({ loginTime: { $gte: startOfMonth, $lte: endOfMonth } }),
      Patient.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Prescription.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),

      // 5. Analytics
      Prescription.aggregate([{ $match: dateFilter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Prescription.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Patient.aggregate([{ $match: dateFilter }, { $group: { _id: "$gender", count: { $sum: 1 } } }]),

      // 6. Recent Tables
      Prescription.find(dateFilter).sort({ createdAt: -1 }).limit(6).populate('doctorId', 'name').select('prescriptionId patient.name branch status createdAt'),
      TransactionLog.find(transactionDateFilter).sort({ transactionTime: -1 }).limit(6).select('transactionType transactionCode userEmail amount status transactionTime'),
      UserLog.find().sort({ loginTime: -1 }).limit(6).select('userEmail username role branch loginTime')
    ]);

    // Processing results
    const totalRevenue = globalRevenueResult[0]?.totalRevenue || 0;
    const todaysRevenue = todaysRevenueData[0]?.total || 0;
    const todaysSuccessfulTransactions = todaysRevenueData[0]?.count || 0;
    const thisMonthRevenue = thisMonthRevenueData[0]?.total || 0;
    const thisMonthSuccessfulTransactions = thisMonthRevenueData[0]?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalRevenue, totalPatients, totalPrescriptions, totalDoctors,
          totalUsers, totalChambers, totalMedicines, totalLabTests, totalLabDepts
        },
        pendingActions: {
          inactiveLabTests,
          pendingMedicines,
          inactiveUsers,
          draftPrescriptions
        },
        todaysActivity: {
          todaysRevenue, todaysSuccessfulTransactions, todaysFailedTransactions,
          todaysLogins, newPatientsToday, todaysPrescriptions
        },
        thisMonthActivity: {
          thisMonthRevenue, thisMonthSuccessfulTransactions, thisMonthFailedTransactions,
          thisMonthLogins, newPatientsThisMonth, thisMonthPrescriptions
        },
        systemStats: { prescriptionsOverTime, prescriptionStatus: prescriptionStatusStats },
        demographics: { gender: patientGenderStats },
        recentActivity: { recentPrescriptions, recentTransactions, recentLogins }
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
  }
};