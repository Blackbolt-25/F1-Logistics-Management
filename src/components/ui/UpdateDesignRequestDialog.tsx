'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface UpdateDesignRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestUpdated: () => void;
  requestId: string;
  fiaAdminId: string | null;
}

export default function UpdateDesignRequestDialog({
  isOpen,
  onClose,
  onRequestUpdated,
  requestId,
  fiaAdminId
}: UpdateDesignRequestDialogProps) {
  const [designComments, setDesignComments] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchExistingComments()
    }
  }, [isOpen, requestId])

  const fetchExistingComments = async () => {
    if (!requestId) return

    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}')
      const { username, password } = credentials

      const response = await fetch(`/api/requests/${requestId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDesignComments(data.design_comments || '')
      } else {
        console.error('Failed to fetch existing comments')
      }
    } catch (error) {
      console.error('Error fetching existing comments:', error)
    }
  }

  const handleSubmit = async (approved: boolean) => {
    if (!requestId || !fiaAdminId) return

    setIsApproving(true)
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}')
      const { username, password } = credentials

      const response = await fetch('/api/design/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: JSON.stringify({
          requestId,
          designComments,
          approved,
          fiaAdminId
        }),
      })

      if (response.ok) {
        toast({
          title: approved ? "Design approved" : "Comments updated",
          description: approved ? "The design has been approved." : "The comments have been updated.",
        })
        onRequestUpdated()
        onClose()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error updating request",
          description: errorData.message || "An error occurred while updating the request.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Design Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="design-comments" className="text-right">
              Design Comments
            </label>
            <Textarea
              id="design-comments"
              value={designComments}
              onChange={(e) => setDesignComments(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleSubmit(false)} disabled={isApproving}>
            Update Comments
          </Button>
          <Button onClick={() => handleSubmit(true)} disabled={isApproving}>
            Approve Design
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
