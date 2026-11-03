import StudioDetails from "../../../components/StudioDetails";
export const metadata = { title: "Studio details" };
export default async function Page({ params }) {
  const { id } = await params;
  return <StudioDetails key={id} id={id} />;
}
