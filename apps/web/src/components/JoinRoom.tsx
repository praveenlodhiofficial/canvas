import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function JoinRoom() {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Enter room ID" className="sketch-border"/>
      <Button variant="default" className="sketch-border">Join Room</Button>
    </div>
  );
}