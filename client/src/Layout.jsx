import { Outlet } from "react-router-dom";
import { Footer, Header } from "./components/layout";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
