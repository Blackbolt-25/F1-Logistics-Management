import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Race {
  race_id: string;
  race_name: string;
}

interface Request {
  request_id: string;
  race_id: string;
  // ... other fields
}

interface UpdateRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestUpdated: () => void;
  req: Request | null;
}

export default function UpdateRequestDialog({ isOpen, onClose, onRequestUpdated, req }: UpdateRequestDialogProps) {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchRaces();
    }
  }, [isOpen]);

  useEffect(() => {
    if (req) {
      setSelectedRace(req.race_id);
    }
  }, [req]);

  const fetchRaces = async () => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;
      const response = await fetch('/api/races', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRaces(data);
      } else {
        console.error('Failed to fetch races');
        toast({
          title: "Error",
          description: "Failed to fetch races. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching races:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching races.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!req) return;

    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch(`/api/requests/${req.request_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: JSON.stringify({
          raceId: selectedRace,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Request updated successfully",
        });
        onRequestUpdated();
        onClose();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "An error occurred while updating the request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the request.",
        variant: "destructive",
      });
    }
  };

  if (!req) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="race" className="text-right">
              Race
            </label>
            <Select onValueChange={setSelectedRace} value={selectedRace}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a race" />
              </SelectTrigger>
              <SelectContent>
                {races.map((race) => (
                  <SelectItem key={race.race_id} value={race.race_id}>
                    {race.race_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Update Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
