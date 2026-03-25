import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LoginHistoryDocument } from './login-history.schema';

@Injectable()
export class LoginHistoryService {
  constructor(
    @InjectModel('LoginHistory')
    private readonly loginHistoryModel: Model<LoginHistoryDocument>,
  ) {}

  //create login history
  async createLoginHistory(
    employeeId: Types.ObjectId,
    name: string,
    role: string,
    isAuthenticated: boolean,
  ): Promise<LoginHistoryDocument> {
    const loginHistory = new this.loginHistoryModel({
      employeeId,
      name,
      role,
      isAuthenticated,
      login: new Date(),
    });

    return loginHistory.save();
  }

  //get All login history
  async getLoginHistory(): Promise<LoginHistoryDocument[]> {
    return await this.loginHistoryModel.find().sort({ createdAt: -1 }).exec();
  }

  //update login history
  async updateLogoutDate(
    employeeId: Types.ObjectId,
    logoutDate: Date,
  ): Promise<LoginHistoryDocument> {
    return await this.loginHistoryModel
      .findOneAndUpdate(
        { employeeId: employeeId, isAuthenticated: true },
        { logout: logoutDate, isAuthenticated: false },
        { new: true },
      )
      .exec();
  }
}
