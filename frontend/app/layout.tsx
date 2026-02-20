import "./globals.css";
import SystemProgressBar from "@/components/SystemProgressBar";

export const metadata = {
  title: "Edurance",
  description: "AI-powered education platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SystemProgressBar />

        <div className="min-h-screen w-full px-6 py-6 fade-up">
          {children}
        </div>
      </body>
    </html>
  );
}
