require('./../config/db.config');
const bcrypt = require('bcryptjs');
const UserModel = require('../modules/user/user.model');
const { statusType, UserRoles } = require('../config/constants.config');

const adminUsers = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: "$2a$10$4XUtO0EAibYWu9zIU5Zl9OZeLlUKApwoqyA1Na2GiIcv0VnIqEhO2", //used instead of bcryptsync due to errors
    role: UserRoles.ADMIN,
    status: statusType.ACTIVE, // THIS IS KEY for immediate login
    title: "ADMINISTRATOR",
    expertise: "Full Stack Development, Project Management",
    bio: "Experienced administrator overseeing system operations and development initiatives.",
    image: "https://placehold.co/150x150/007bff/ffffff?text=ADMIN",
    facebook: "https://www.facebook.com/admin_profile",
    twitter: "https://x.com/admin_profile",
    linkedin: "https://www.linkedin.com/in/admin_profile/",
    phone: "123-456-7890",
    address: "123 Admin Street, City, Country"
  }
];

const seedUser = async () => {
  try {
    for (const user of adminUsers) {
      console.log("🔍 Checking for existing user:", user.email);

      const existingUser = await UserModel.findOne({ email: user.email });

      if (!existingUser) {
        console.log("🆕 Creating user:", user.email);
        const userObj = new UserModel(user);
        await userObj.save();
        console.log("✅ User created successfully");
      } else {
        console.log("⚠️ User already exists:", user.email);
      }
    }
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    process.exit(0);
  }
};

seedUser();


// const seedUser =() => {
//     try {
//         adminUsers.map(async(user) => {
//             const userExisting = await UserModel.findOne({ email: user.email });
//             if (!userExisting) {
//                 const userObj = new UserModel(user);
//                 await userObj.save();
//                 console.log('User created successfully');
//             }
//         })
//     }
//     catch (exception) {
//         console.log(exception);
//     }
//     process.exit(0);
// }

// seedUser();