export interface ProfileDataBasic {
  username: string;
  avatarUrl: string;
}

export interface ProfileDataDisplay extends ProfileDataBasic {
  followersCount: number;
  followingCount: number;
}

export interface ProfileDataPersonal extends ProfileDataBasic {
  bio: string;
  gender: string;
  birthday: Date;
  phone: string;
  email: string;
  profileBg: string;
}

interface BaseProfile<T> {
  profileData: T | null;
}

export type ProfileDisplay = BaseProfile<ProfileDataDisplay>;
export type ProfilePersonal = BaseProfile<ProfileDataPersonal>;
export type ProfileBasic = BaseProfile<ProfileDataBasic>;
