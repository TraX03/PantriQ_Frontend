import { setUser } from "@/redux/slices/authSlice";
import { getCurrentUser } from "@/services/appwrite";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useHydrateUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const user = await getCurrentUser();
        dispatch(setUser(user));
      } catch {
        dispatch(setUser(null));
      }
    };

    hydrate();
  }, []);
}
