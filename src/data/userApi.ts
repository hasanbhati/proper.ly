import { UserProfile } from '../types';

// Simulated user profile data
let mockUserProfile: UserProfile = {
  id: 'demo',
  firstName: 'Demo',
  lastName: 'User',
  companyName: 'Proper.Ly',
  email: 'demo@proper.ly',
  phone: '+965 555-1234',
};

let mockPassword = 'Prop@demo';

export async function getUserProfile(): Promise<UserProfile> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...mockUserProfile };
}

export async function updateUserProfile(
  profile: UserProfile,
  password: string
): Promise<{ success: boolean; message: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (password !== mockPassword) {
    return { success: false, message: 'Incorrect password.' };
  }
  mockUserProfile = { ...profile };
  return { success: true, message: 'Profile updated successfully.' };
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (currentPassword !== mockPassword) {
    return { success: false, message: 'Current password is incorrect.' };
  }
  mockPassword = newPassword;
  return { success: true, message: 'Password updated successfully.' };
} 