import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CommunityComponent from "./component";
import useCommunityController from "./controller";

type Props = {
  communityId: string;
};

export default function CommunityContainer({ communityId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { community, getCommunity } = useCommunityController();

  useEffect(() => {
    (async () => {
      try {
        await getCommunity(communityId);
      } catch (error) {
        console.error("Failed to load community:", error);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  }, [communityId]);

  return <CommunityComponent community={community} />;
}
