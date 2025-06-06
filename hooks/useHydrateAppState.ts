import { setUser } from "@/redux/slices/authSlice";
import { setInteractionMap } from "@/redux/slices/interactionSlice";
import { AppDispatch } from "@/redux/store";
import { getCurrentUser } from "@/services/appwrite";
import { fetchInteractions } from "@/utility/interactionUtils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useHydrateAppState() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const user = await getCurrentUser();
        dispatch(setUser(user));

        const map = await fetchInteractions();
        dispatch(setInteractionMap(map));
      } catch {
        dispatch(setUser(null));
        dispatch(setInteractionMap(new Map()));
      }
    };

    hydrate();
  }, []);
}
