import { useEffect } from "react";
import EditPreferencesComponent from "./component";
import { useEditPreferencesController } from "./controller";

export default function EditPreferencesContainer({}) {
  const { regionPreferences, refetch, handleSave } =
    useEditPreferencesController();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <EditPreferencesComponent
      regionPreferences={regionPreferences}
      handleSave={handleSave}
    />
  );
}
