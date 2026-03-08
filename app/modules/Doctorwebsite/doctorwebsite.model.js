import mongoose from "mongoose";

const { Schema, model } = mongoose;

const QualificationSchema = new Schema(
    {
        spokenLanguages: { type: String, default: "" },
        bmdcRegistrationNumber: { type: String, default: "" },
        deaNumber: { type: String, default: "" },
        npiNumber: { type: String, default: "" },
        educationDegrees: { type: String, default: "" },
        professionalCertification: { type: String, default: "" },
        professionalMembership: { type: String, default: "" },
    },
    { _id: false }
);

const SpecializationSchema = new Schema(
    {
        specialization: { type: String, default: "" },
        description: { type: String, default: "" },
    },
    { _id: false }
);

const TestimonialSchema = new Schema(
    {
        patientName: { type: String, default: "" },
        rating: { type: Number, default: 0 },
        reviewText: { type: String, default: "" },
        profileImageUrl: { type: String, default: "" },
    },
    { _id: false }
);

const DoctorWebsiteSchema = Schema(
    {
        info: {
            fullName: {
                type: String,
                required: [true, "Please provide the full name"],
            },
            shortName: { type: String, default: "" },
            subtitle: { type: String, default: "" },
            mobile: { type: String, default: "" },
            whatsappNumber: { type: String, default: "" },
            email: { type: String, default: "" },
            designation: { type: String, default: "" },
            specialization: { type: String, default: "" },
            primaryCredentials: { type: String, default: "" },
        },

        qualifications: QualificationSchema,

        logoBranding: {
            useProfilePicture: { type: Boolean, default: false },
            picture: { type: String, default: "" },
            digitalSignature: { type: String, default: "" },
            shortDescription: { type: String, default: "" },
            currency: { type: String, default: "" },
        },

        specializationsExpertise: [SpecializationSchema],

        statisticsDisplay: {
            happyPatientsCount: { type: Number, default: 0 },
            yearsOfExperience: { type: Number, default: 0 },
            patientRating: { type: Number, default: 0 },
            supportAvailability: { type: String, default: "" },
        },

        aboutMe: {
            sectionTitle: { type: String, default: "" },
            professionalBackground: { type: String, default: "" },
            clinicalExcellence: { type: String, default: "" },
            commitmentToCare: { type: String, default: "" },
            memberships: { type: String, default: "" },
            medicalExpertise: { type: String, default: "" },
            professionalApproach: { type: String, default: "" },
            professionalMemberships: { type: String, default: "" },
        },

        appointment: {
            hospitalNameAddress: { type: String, default: "" },
            mobile: { type: String, default: "" },
            emergencyNumber: { type: String, default: "" },
        },

        socialMedia: {
            facebook: { type: String, default: "" },
            twitter: { type: String, default: "" },
            instagram: { type: String, default: "" },
            linkedIn: { type: String, default: "" },
            youtube: { type: String, default: "" },
        },

        testimonials: [TestimonialSchema],

        branch: {
            type: String,
            required: [true, "Please provide the branch"],
            unique: true,
        },
    },
    { timestamps: true }
);

const DoctorWebsite = model("DoctorWebsite", DoctorWebsiteSchema);

export default DoctorWebsite;