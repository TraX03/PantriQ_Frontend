import OnboardingComponent from "./component";
import useOnboardingController from "./controller";

export default function OnboardingContainer() {
  const { onboarding, handleNext, handlePrevious, addCustomSuggestion } =
    useOnboardingController();

  return (
    <OnboardingComponent
      onboarding={onboarding}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      addCustomSuggestion={addCustomSuggestion}
    />
  );
}
