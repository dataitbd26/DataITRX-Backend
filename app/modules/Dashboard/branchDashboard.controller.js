import moment from "moment";
import Chamber from "../Chamber/Chambers.model.js";
import DoctorProfile from "../DoctorProfile/DoctorProfiles.model.js";
import DoctorWebsite from "../Doctorwebsite/DoctorWebsites.model.js";
import Patient from "../Patient/Patients.model.js";
import Prescription from "../Prescription/Prescription.model.js";
import PrescriptionTemplate from "../PrescriptionTemplates/PrescriptionTemplates.model.js";
import User from "../User/Users.model.js";
import axios from "axios";
/// Helper function to map OpenWeather condition codes to emojis
const getOpenWeatherEmoji = (iconCode) => {
  const iconMap = {
    "01d": "☀️", "01n": "🌙",
    "02d": "⛅", "02n": "☁️",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️"
  };
  return iconMap[iconCode] || "🌡️";
};

export const getBranchDashboard = async (req, res) => {
  try {
    const branch = req.user?.branch || req.query.branch;

    if (!branch) {
      return res.status(400).json({ success: false, message: "Branch identifier is required." });
    }

    const baseFilter = { branch };

    // 1. Fetch Doctor Profile FIRST (Needed for Weather Location)
    const doctorProfile = await DoctorProfile.findOne(baseFilter);
    const doctorDistrict = doctorProfile?.district || "Dhaka"; // Fallback to Dhaka

    // 2. Setup Weather Promise using the dynamic district
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherPromise = apiKey
      ? axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${doctorDistrict}&units=metric&appid=${apiKey}`)
        .then(res => res.data)
        .catch(err => {
          console.error("OpenWeather fetch failed:", err.message);
          return null;
        })
      : Promise.resolve(null);

    // 3. Setup Date Boundaries
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();

    // 4. Run all other DB queries AND the weather fetch concurrently
    const [
      totalPatients, totalPrescriptions, totalDoctors, totalUsers, totalTemplates, totalChambers, totalDoctorWebsites,
      newPatientsToday, prescriptionsToday,
      newPatientsThisMonth, prescriptionsThisMonth,
      draftPrescriptions, completedPrescriptions, cancelledPrescriptions,
      activeUsers, inactiveUsers, staffRolesDistribution,
      patientGenderDistribution, prescriptionsLast30Days,
      recentPrescriptions, recentPatients, recentUsers, recentTemplates,
      currentWeather // <--- OpenWeather Response
    ] = await Promise.all([
      Patient.countDocuments(baseFilter),
      Prescription.countDocuments(baseFilter),
      DoctorProfile.countDocuments(baseFilter),
      User.countDocuments(baseFilter),
      PrescriptionTemplate.countDocuments(baseFilter),
      Chamber.countDocuments(baseFilter),
      DoctorWebsite.countDocuments(baseFilter),

      Patient.countDocuments({ ...baseFilter, createdAt: { $gte: startOfDay, $lte: endOfDay } }),
      Prescription.countDocuments({ ...baseFilter, createdAt: { $gte: startOfDay, $lte: endOfDay } }),

      Patient.countDocuments({ ...baseFilter, createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Prescription.countDocuments({ ...baseFilter, createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),

      Prescription.countDocuments({ ...baseFilter, status: "Draft" }),
      Prescription.countDocuments({ ...baseFilter, status: "Completed" }),
      Prescription.countDocuments({ ...baseFilter, status: "Cancelled" }),

      User.countDocuments({ ...baseFilter, status: "active" }),
      User.countDocuments({ ...baseFilter, status: { $in: ["inactive", "on-leave"] } }),
      User.aggregate([{ $match: baseFilter }, { $group: { _id: "$role", count: { $sum: 1 } } }]),

      Patient.aggregate([{ $match: baseFilter }, { $group: { _id: "$gender", count: { $sum: 1 } } }]),
      Prescription.aggregate([
        { $match: { ...baseFilter, createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      Prescription.find(baseFilter).sort({ createdAt: -1 }).limit(10).populate("doctorId", "name role").select("prescriptionId patient.name patient.phone status createdAt"),
      Patient.find(baseFilter).sort({ createdAt: -1 }).limit(10).select("fullName phone gender age bloodGroup createdAt"),
      User.find(baseFilter).sort({ createdAt: -1 }).limit(10).select("name email role status createdAt"),
      PrescriptionTemplate.find(baseFilter).sort({ createdAt: -1 }).limit(10).populate("doctorId", "name").select("templateName category isGlobal createdAt"),

      weatherPromise // Execute OpenWeather API alongside DB
    ]);

    // 5. Format the OpenWeather data
    let formattedWeather = { temp: "--", condition: "Unavailable", location: doctorDistrict, icon: "🌡️" };
    if (currentWeather && currentWeather.weather && currentWeather.weather.length > 0) {
      const tempC = Math.round(currentWeather.main.temp);
      const conditionStr = currentWeather.weather[0].main;
      const iconCode = currentWeather.weather[0].icon;

      formattedWeather = {
        temp: `${tempC}°C`,
        condition: conditionStr,
        location: `${currentWeather.name}, ${currentWeather.sys.country}`,
        icon: getOpenWeatherEmoji(iconCode)
      };
    }

    // 6. Format Doctor Profile payload
    const formattedDoctorProfile = doctorProfile ? {
      name: doctorProfile.name,
      designation: doctorProfile.designation,
      degree: doctorProfile.degree,
      department: doctorProfile.institution,
      email: doctorProfile.email,
      phone: doctorProfile.phone,
      picture: doctorProfile.doctorPicture,
      district: doctorDistrict
    } : null;

    // 7. Send Final Response
    res.status(200).json({
      success: true,
      branchName: branch,
      data: {
        doctorProfile: formattedDoctorProfile, // <--- Sent safely to frontend
        weather: formattedWeather,             // <--- Weather customized to doctor's district
        kpis: { totalPatients, totalPrescriptions, totalDoctors, totalUsers, totalTemplates, totalChambers, totalDoctorWebsites },
        todaysActivity: { newPatientsToday, prescriptionsToday },
        thisMonthActivity: { newPatientsThisMonth, prescriptionsThisMonth },
        statusBreakdown: {
          prescriptions: { draft: draftPrescriptions, completed: completedPrescriptions, cancelled: cancelledPrescriptions },
          users: { active: activeUsers, inactiveOrLeave: inactiveUsers }
        },
        charts: { staffRoles: staffRolesDistribution, patientGenders: patientGenderDistribution, prescriptionsTrend: prescriptionsLast30Days },
        recentTables: { recentPrescriptions, recentPatients, recentUsers, recentTemplates }
      },
    });

  } catch (error) {
    console.error(`Branch Dashboard Error:`, error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch branch dashboard data",
      error: error.message
    });
  }
};