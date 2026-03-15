import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DoctorWebsiteSchema = Schema(
    {
        info: {
            fullName: {
                type: String,
                required: [true, "Please provide the full name"],
            },
            shortName: {
                type: String,
            },
            subtitle: {
                type: String,
            },
            mobile: {
                type: String,
            },
            whatsNumber: {
                type: String,
            },
            email: {
                type: String,
            },
            designation: {
                type: String,
            },
            specialization: {
                type: String,
            },
            primaryCredentials: {
                type: String,
            },
        },

        qualifications: {
            spokenLanguages: {
                type: [String],
            },
            bmdcRegistrationNumber: {
                type: String,
                required: [true, "Please provide the BMDC registration number"],
                unique: true,
            },
            deaNumber: {
                type: String,
            },
            npiNumber: {
                type: String,
            },
            educationDegrees: {
                type: [String],
            },
            professionalCertification: {
                type: [String],
            },
            professionalMembership: {
                type: [String],
            },
        },

        logoBranding: {
            useProfilePicture: {
                type: String,
            },
            digitalSignature: {
                type: String,
            },
            shortDescription: {
                type: String,
            },
            currency: {
                type: String,
            },
        },

        specializationsExpertise: {
            type: [
                {
                    specialization: {
                        type: String,
                    },
                    description: {
                        type: String,
                    },
                },
            ],
            validate: {
                validator: function (val) {
                    return val.length <= 5;
                },
                message: "You can store maximum 5 specializations",
            },
        },

        statisticsDisplay: {
            happyPatientsCount: {
                type: Number,
            },
            yearsOfExperience: {
                type: Number,
            },
            patientRating: {
                type: Number,
            },
            supportAvailability: {
                type: String,
            },
        },

        aboutMe: {
            sectionTitle: {
                type: String,
            },
            professionalBackground: {
                type: String,
            },
            clinicalExcellence: {
                type: String,
            },
            commitmentToCare: {
                type: String,
            },
            medicalExpertise: {
                type: String,
            },
            professionalApproach: {
                type: String,
            },
            professionalMemberships: {
                type: String,
            },
        },

        appointment: {
            hospitalNameAddress: {
                type: String,
            },
            mobile: {
                type: String,
            },
            emergencyNumber: {
                type: String,
            },
        },

        socialMedia: {
            facebook: {
                type: String,
            },
            twitter: {
                type: String,
            },
            instagram: {
                type: String,
            },
            linkedIn: {
                type: String,
            },
            youtube: {
                type: String,
            },
        },

        testimonial: {
            type: [
                {
                    patientName: {
                        type: String,
                    },
                    rating: {
                        type: Number,
                    },
                    reviewText: {
                        type: String,
                    },
                    profileImageUrl: {
                        type: String,
                    },
                },
            ],
            validate: {
                validator: function (val) {
                    return val.length <= 5;
                },
                message: "You can store maximum 5 testimonials",
            },
        },

        branch: {
            type: String,
            required: [true, "Please provide the branch"],
        },
    },
    { timestamps: true }
);

const DoctorWebsite = model("DoctorWebsite", DoctorWebsiteSchema);

export default DoctorWebsite;