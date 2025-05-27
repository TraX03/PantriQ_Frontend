export const Routes = {
  CreateForm: "/create/[type]",
  AuthForm: "/authentication/[mode]",
  EditFieldForm: "/profile/settings/editProfile/[key]",
  PostDetail: "/posts/[id]",
  Search: "/search/container",
  Settings: "/profile/settings/container",
  EditProfile: "/profile/settings/editProfile/container",
  Onboarding: "/onboarding/container",
  Home: "/",
} as const;
