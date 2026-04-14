'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  FileText,
  Calendar,
  Search,
  StickyNote,
} from 'lucide-react'
import type { UserNote } from '@/types'

export function NotesView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const queryClient = useQueryClient()

  const { data: notes, isLoading } = useQuery<UserNote[]>({
    queryKey: ['notes'],
    queryFn: () => fetch('/api/notes').then((r) => r.json()),
  })

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; lessonId: string | null }) =>
      fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setCreateOpen(false)
      setNewTitle('')
      setNewContent('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/notes?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return
    createMutation.mutate({ title: newTitle, content: newContent, lessonId: null })
  }

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
            <StickyNote className="h-7 w-7 text-emerald-500" />
            Ghi chú
          </h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý ghi chú học tập của bạn
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tạo ghi chú</span>
              <span className="sm:hidden">Tạo mới</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo ghi chú mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="note-title">Tiêu đề</Label>
                <Input
                  id="note-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nhập tiêu đề..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-content">Nội dung</Label>
                <Textarea
                  id="note-content"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Nhập nội dung ghi chú..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newTitle.trim() || !newContent.trim() || createMutation.isPending}
                >
                  {createMutation.isPending ? 'Đang tạo...' : 'Tạo ghi chú'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm ghi chú..."
          className="pl-10"
        />
      </div>

      {/* Notes list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filteredNotes && filteredNotes.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0 mt-0.5">
                        <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{note.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                          </span>
                          {note.lessonId && (
                            <Badge variant="secondary" className="text-[10px]">
                              Đã liên kết bài học
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate(note.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-3xl mb-4">
            📝
          </div>
          <h3 className="font-semibold text-lg">
            {searchTerm ? 'Không tìm thấy ghi chú' : 'Chưa có ghi chú nào'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchTerm
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Tạo ghi chú đầu tiên để ghi lại những kiến thức quan trọng'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setCreateOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Tạo ghi chú
            </Button>
          )}
        </motion.div>
      )}
    </div>
  )
}
