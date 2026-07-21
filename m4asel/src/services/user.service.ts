import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import type { UserProfileBasic } from "@/types/api";

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const userService = {
  /**
   * Update user profile information (name, mobile_number)
   */
  async updateProfile(data: Partial<UserProfileBasic>): Promise<UserProfileBasic> {
    return apiClient.put<UserProfileBasic>(endpoints.users.update, data);
  },

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post<void>(endpoints.users.changePassword, data);
  },
};
