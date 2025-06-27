import { setOnboarded, setUser } from "@/redux/slices/authSlice";
import { setInteractionMap } from "@/redux/slices/interactionSlice";
import { AppDispatch } from "@/redux/store";
import { getCurrentUser } from "@/services/Appwrite";
import { fetchInteractions } from "@/utility/interactionUtils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useProfileData } from "./useProfileData";

export function useHydrateAppState() {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const user = await getCurrentUser();
        dispatch(setUser(user));

        if (user) {
          const onboarded = await fetchProfile();
          dispatch(setOnboarded(onboarded ?? true));

          const map = await fetchInteractions();
          dispatch(setInteractionMap(map));
        }
      } catch {
        dispatch(setUser(null));
        dispatch(setInteractionMap(new Map()));
      }
    };

    hydrate();
  }, []);
}
