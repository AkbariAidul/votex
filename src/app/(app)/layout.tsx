import AppNavbar from "@/components/AppNavbar"; // <-- Navbar BARU yang lebih simpel
import Footer from "@/components/Footer";

// Layout ini untuk SEMUA halaman setelah user login (dashboard, profile, dll)
export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <AppNavbar />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}