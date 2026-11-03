import BookingGuide from "../../components/BookingGuide";
export const metadata = { title: "How it works" };
export default function How() {
  return (
    <>
      <div className="shell page-intro">
        <p className="eyebrow">Creator handbook</p>
        <h1>
          From shortlist to <em>shoot day.</em>
        </h1>
        <p>Choose a studio, reserve the hours and follow the booking at your desk.</p>
      </div>
      <BookingGuide />
    </>
  );
}
