import UserModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    const { userId } = req.body;
      try {
        const user = await UserModel.findById(userId);
        if (!user) {
         return res.json({ success: false, message: "Data not Found" });
        }
        res.json({
          success: true,

          userData: {
            name: user.name,
              isAccountVerified: user.isAccountVerified,
            
          },
        });
      } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
      }
}