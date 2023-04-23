import User from "../model/user_model";
import { getSafetyUser } from "../utils/SafetyUserUtils"
import { editAttr } from "./type/serviceType"
import { safeUserInfo } from "../common/type/responseResultType";
import errorTypes from "../common/constant/error-types";
import { sendError } from "../utils/sendError";
import { Context } from "koa";
import minDistance from "../utils/AlgorithmUtils";
import user from "../model/user_model";
import { Op } from "sequelize";
import { userInfo } from "os";
import { RequestMatchKey, RequestChangeUserTags } from "../common/type/requestParam";
import Tag from "../model/tagList_model";
import Administrators from "../model/administrators_model";

class AdminService {
  async getAdminByAccount(account, password) {
    const res = await Administrators.findOne({
      attributes: { exclude: ['userPassword'] },
      where: {
        userAccount: account,
        userPassword: password
      }
    })
    return res
  }
  async getAdminById(account) {
    const res = await Administrators.findOne({
      attributes: { exclude: ['userPassword'] },
      where: {
        userAccount: account
      }
    })
    return res
  }
}

export default new AdminService