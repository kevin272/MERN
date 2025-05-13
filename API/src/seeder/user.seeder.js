require('./../config/db.config');
const bcrypt = require('bcryptjs');
const UserModel = require('../modules/user/user.model');
const { statusType, UserRoles } = require('../config/constants.config');

const adminUsers = [
  {
    name: "Kebin Malla",
    email: "mallakebin@gmail.com",
    password: bcrypt.hashSync("admin2060", 10),
    role: UserRoles.ADMIN,
    status: statusType.ACTIVE,
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