export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-10 flex h-screen w-screen flex-col bg-white">
      {children}
    </div>
  );
}
