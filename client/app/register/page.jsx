import { Suspense } from "react";
import AuthForm from "../../components/AuthForm";
import { Loading } from "../../components/States";
export const metadata = { title: "Register" };
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthForm register />
    </Suspense>
  );
}
