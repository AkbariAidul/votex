import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

// Layout ini HANYA untuk halaman landing page publik
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PublicNavbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}