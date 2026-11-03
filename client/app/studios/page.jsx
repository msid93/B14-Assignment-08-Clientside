import { Suspense } from "react";
import Explore from "../../components/Explore";
import { Loading } from "../../components/States";
export const metadata = { title: "Explore studios" };
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Explore />
    </Suspense>
  );
}
