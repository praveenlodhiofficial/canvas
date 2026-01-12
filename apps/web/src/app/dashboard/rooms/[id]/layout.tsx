export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="z-10 absolute inset-0 flex bg-white flex-col w-screen h-screen">{children}</div>;
}