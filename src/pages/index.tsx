import Header from "../components/Header";
import USAMap from "../components/USAMap";

export default function Home() {
  const pastorId = "1";

  return (
    <div>
      <Header pastorId={pastorId} />
      <USAMap />
    </div>
  );
}
