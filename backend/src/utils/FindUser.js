import { User } from '../models/user.model.js';

export const findUser = async (id) => {
    try {
        const user = await User.findById(id).select("-password -refreshToken");

        if (!user) {
            throw new Error("User not found");
        }

        let tempUser;

        if (user.childId != "none") {
            if (user.role == "student") {
                tempUser = await Student.findById(user.childId);
            } else if (user.role == "staff") {
                tempUser = await Staff.findById(user.childId);
            }
        }else{
            tempUser = user;
        }

        return tempUser;

    } catch (error) {
        console.log("Error finding user:", error);
    }
}