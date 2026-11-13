import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <footer className="py-6 text-center text-sm text-gray-500">
        Based on the{" "}
        <a
          className="underline hover:text-primary"
          href="https://www.youtube.com/watch?v=pQoHvx0SoiA"
          target="_blank"
          rel="noopener noreferrer"
        >
          Expense Tracker tutorial
        </a>{" "}
        by{" "}
        <a
          className="underline hover:text-primary"
          href="https://www.youtube.com/@tubeguruji"
          target="_blank"
          rel="noopener noreferrer"
        >
          TubeGuruji
        </a>
        .
      </footer>
    </div>
  );
}
