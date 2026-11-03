import StudioForm from "../../../../components/StudioForm";
export const metadata = { title: "Edit a studio" };
export default async function Page({ params }) {
  const { id } = await params;
  return <StudioForm id={id} />;
}
