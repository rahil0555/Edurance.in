import "./globals.css";

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
        {/* Global cinematic container */}
        <div className="min-h-screen w-full flex items-center justify-center px-4">
          {/* App shell */}
          <div className="w-full max-w-7xl motion-fade-in">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
