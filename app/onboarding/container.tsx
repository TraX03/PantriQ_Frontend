import OnboardingComponent from "./component";
import useOnboardingController from "./controller";

export default function OnboardingContainer() {
  const { onboarding, actions, isNextEnabled } = useOnboardingController();

  return (
    <OnboardingComponent
      onboarding={onboarding}
      isNextEnabled={isNextEnabled}
      actions={actions}
    />
  );
}
