import HomeContainer from "../home/container";

if (__DEV__) {
  require("@/ReactotronConfig");
}

export default function HomeScreenRoute() {
  return <HomeContainer />;
}
