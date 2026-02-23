import Company from "../app/modules/Company/Companys.model.js";
import Product from "../app/modules/Product/Product.model.js";
import Category from "../app/modules/Catagorie/Catagories.model.js";
import UserLog from "../app/modules/UserLog/UserLog.model.js";
import Invoice from "../app/modules/Invoice/Invoices.model.js";
import TransactionLog from "../app/modules/TransactionLog/TransactionLog.model.js";
import moment from "moment";

export const getSuperAdminDashboard = async (req, res) => {
  try {
    // Count total branches, products, and categories
    const totalBranches = await Company.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get today's date range
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // Today's Logins
    const todaysLogins = await UserLog.countDocuments({
      loginTime: { $gte: startOfDay, $lte: endOfDay },
    });

    // Total User Logs
    const totalUserLogs = await UserLog.countDocuments();

    // Successful Logins (users who logged in and have a logout time)
    const totalSuccessLogins = await UserLog.countDocuments({
      logoutTime: { $exists: true, $ne: null },
    });

    // Error Logs (users who didn't log out)
    const totalErrorLogs = await UserLog.countDocuments({
      logoutTime: { $exists: false },
    });

    // **Today's Transactions Count (Total invoices created today)**
    const todaysTransactions = await Invoice.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // **Today's Sales (Total revenue from invoices created today)**
    const todaysSales = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalSale: { $sum: "$totalSale" },
        },
      },
    ]);

    // **Total Success Transactions (Transaction Logs with 'success' status)**
    const totalSuccessTransactions = await TransactionLog.countDocuments({
      status: "success",
      transactionTime: { $gte: startOfDay, $lte: endOfDay },
    });

    // **Total Error Transactions (Transaction Logs with 'failed' status)**
    const totalErrorTransactions = await TransactionLog.countDocuments({
      status: "failed",
      transactionTime: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({
      totalBranches,
      totalProducts,
      totalCategories,
      todaysLogins,
      todaysTransactions,
      todaysSales: todaysSales[0]?.totalSale || 0,
      totalSuccessLogins,
      totalErrorLogs,
      totalUserLogs,
      totalSuccessTransactions,
      totalErrorTransactions,
    });
  } catch (error) {
    console.error("Error fetching super admin dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
