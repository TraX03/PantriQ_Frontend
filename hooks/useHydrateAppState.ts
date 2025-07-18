import { setOnboarded, setUser } from "@/redux/slices/authSlice";
import { setInteractionRecords } from "@/redux/slices/interactionSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
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
      dispatch(setLoading(true));

      try {
        const user = await getCurrentUser();
        dispatch(setUser(user));

        if (user) {
          const onboarded = await fetchProfile();
          dispatch(setOnboarded(onboarded ?? true));

          const interactionRecords = await fetchInteractions();
          dispatch(setInteractionRecords(interactionRecords));
        }
      } catch {
        dispatch(setUser(null));
        dispatch(setInteractionRecords({}));
      } finally {
        dispatch(setLoading(false));
      }
    };

    hydrate();
  }, []);
}
