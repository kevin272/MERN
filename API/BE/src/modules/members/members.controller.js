const teamService = require("./members.services");
const { uploadImage, cloudinary } = require("../../config/cloudinary.config");
const { deleteFile } = require("../../../utilis/helper");

const getCloudinaryUrl = (publicId) => {
  return `https://res.cloudinary.com/${cloudinary.config().cloud_name}/image/upload/${publicId}`;
};

class MemberController {
  // Get all team members
  getMembers = async (req, res, next) => {
    try {
      const teamMembers = await teamService.getAllMembers();

      res.status(200).json({
        data: teamMembers,
        message: "All team members retrieved successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new team member
  createMember = async (req, res, next) => {
    try {
      const data = await teamService.transformMemberCreate(req);
      data.createdby = req.authUser?.id;
  
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
  
      const publicId = await uploadImage(`./public/uploads/teammembers/${req.file.filename}`);
      data.image = publicId;
      deleteFile(`./public/uploads/teammembers/${req.file.filename}`);
  
      const newMember = await teamService.createMember(data);
  
      await teamService.sendActivationEmail(data);
  
      res.status(201).json({
        data: newMember,
        message: "Team member created successfully, activation email sent",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };
  

  // Get team member details by ID
  getMemberById = async (req, res, next) => {
    try {
      const { id } = req.params;


      const members = await teamService.getSingleMemberById(id);

      if (Array.isArray(members)) {
        members.forEach(member => {
          member.image = getCloudinaryUrl(member.image); // Use the URL function here
        });
      } else {
        members.image = getCloudinaryUrl(members.image); // If it's a single object, format the image URL
      }

      res.status(200).json({
        data: members,
        message: "Team member details retrieved successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update team member details
  updateMember = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await teamService.transformMemberCreate(req);
      data.createdby = req.authUser?.id;
  
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
  
      // Upload image and get the public ID from Cloudinary
      const publicId = await uploadImage(`./public/uploads/teammembers/${req.file.filename}`);
      data.image = publicId;
  
      // Delete the file from the local uploads folder
      deleteFile(`./public/uploads/teammembers/${req.file.filename}`);
  
      // Update the team member in the database
      const updatedMember = await teamService.updateById(id, data);
  
      res.status(200).json({
        data: updatedMember,
        message: "Team member updated successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  getMembersForAdmin = async (req, res, next) => {
    try {
      const { page = 1, limit = 5, search } = req.query;
      let filter = {};

      if (search) {
        filter.fullname = { $regex: search, $options: "i" };
      }

      const { members, totalPages, total, currentPage } =
        await teamService.listMembers(page, limit, filter);

        members.forEach(member => {
            member.image = getCloudinaryUrl(member.image); // Use the URL function here
          });


      res.json({
        data: members,
        message: "List of members for admin",
        meta: {
          total,
          currentPage,
          totalPages,
          limit,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  // Delete team member by ID
  deleteMember = async (req, res, next) => {
    try {
      const { id } = req.params;
      await teamService.deleteById(id);

      res.status(200).json({
        data: null,
        message: "Team member deleted successfully",
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

// Create an instance of the controller
const memberController = new MemberController();

// Export the controller
module.exports = memberController;
