'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { RoomCard } from '@/components/RoomCard'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Grid2x2, List } from 'lucide-react'
import { CreateRoomDialog } from '@/components/CreateRoomDialog'

interface Room {
  id: string
  name: string
  description: string
  members: number
  maxMembers: number
  isPrivate: boolean
  lastModified: string
  members_preview: Array<{ initials: string; color: string }>
}

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Brand Identity 2024',
    description: 'Collaborative workspace for brand refresh and identity guidelines',
    members: 5,
    maxMembers: 10,
    isPrivate: false,
    lastModified: '2 hours ago',
    members_preview: [
      { initials: 'JD', color: 'bg-blue-500' },
      { initials: 'AS', color: 'bg-purple-500' },
      { initials: 'MC', color: 'bg-pink-500' },
    ],
  },
  {
    id: '2',
    name: 'Product Design System',
    description: 'Create unified design components and patterns for our platform',
    members: 8,
    maxMembers: 15,
    isPrivate: true,
    lastModified: '1 hour ago',
    members_preview: [
      { initials: 'KR', color: 'bg-green-500' },
      { initials: 'TJ', color: 'bg-orange-500' },
      { initials: 'LP', color: 'bg-red-500' },
      { initials: 'MS', color: 'bg-cyan-500' },
    ],
  },
  {
    id: '3',
    name: 'Q2 Marketing Campaign',
    description: 'Design assets and creative direction for upcoming campaign',
    members: 3,
    maxMembers: 8,
    isPrivate: false,
    lastModified: 'Yesterday',
    members_preview: [
      { initials: 'NW', color: 'bg-indigo-500' },
      { initials: 'RH', color: 'bg-amber-500' },
    ],
  },
  {
    id: '4',
    name: 'Website Redesign 2025',
    description: 'Complete overhaul of our main website with modern design principles',
    members: 6,
    maxMembers: 12,
    isPrivate: true,
    lastModified: '3 days ago',
    members_preview: [
      { initials: 'EP', color: 'bg-rose-500' },
      { initials: 'DS', color: 'bg-teal-500' },
      { initials: 'JL', color: 'bg-violet-500' },
    ],
  },
  {
    id: '5',
    name: 'Mobile App Mockups',
    description: 'User interface designs for iOS and Android applications',
    members: 4,
    maxMembers: 10,
    isPrivate: false,
    lastModified: '5 days ago',
    members_preview: [
      { initials: 'AK', color: 'bg-sky-500' },
      { initials: 'CM', color: 'bg-lime-500' },
    ],
  },
  {
    id: '6',
    name: 'Design Exploration',
    description: 'Experimental concepts and visual experiments',
    members: 2,
    maxMembers: 10,
    isPrivate: true,
    lastModified: 'Last week',
    members_preview: [{ initials: 'TS', color: 'bg-fuchsia-500' }],
  },
]

export default function RoomsDashboard() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateRoom = (data: {
    name: string
    description: string
    isPrivate: boolean
  }) => {
    const newRoom: Room = {
      id: String(rooms.length + 1),
      ...data,
      members: 1,
      maxMembers: 10,
      lastModified: 'Just now',
      members_preview: [{ initials: 'YU', color: 'bg-primary' }],
    }
    setRooms([newRoom, ...rooms])
  }

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Workspace Rooms
              </h1>
              <p className="text-muted-foreground mt-2">
                Create and manage collaborative canvas rooms for your team
              </p>
            </div>
            <CreateRoomDialog/>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid2x2 className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>

          {/* Rooms Grid/List */}
          {filteredRooms.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  {...room}
                  onOpen={() => console.log('Opening room:', room.id)}
                  onDelete={() => handleDeleteRoom(room.id)}
                />
              ))}
            </div>
          ) : (
            <Empty
              // icon="inbox"
              title="No rooms found"
              // description="Try adjusting your search or create a new room to get started"
            />
          )}
        </div>
      </main>
    </div>
  )
}
