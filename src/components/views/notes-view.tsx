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
          <h1
            className="text-lg font-bold tracking-tight sm:text-xl flex items-center gap-2"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}
          >
            <StickyNote className="h-6 w-6 text-emerald-600" />
            Ghi chú
          </h1>
          <p className="mt-1 text-muted-foreground text-xs">
            Quản lý ghi chú học tập của bạn
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button
              className="gap-2 shrink-0 flex items-center bg-[#e11d48] text-white border-4 border-black shadow-[4px_4px_0_#000] px-4 py-2 text-xs font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all duration-150"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tạo ghi chú</span>
              <span className="sm:hidden">Tạo mới</span>
            </button>
          </DialogTrigger>
          <DialogContent className="border-4 border-black bg-[#fef3c7] shadow-[8px_8px_0_#000] p-0">
            <div className="p-6">
              <DialogHeader>
                <DialogTitle
                  className="text-base font-bold"
                  style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px' }}
                >
                  Tạo ghi chú mới
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="note-title" className="text-xs font-bold">Tiêu đề</Label>
                  <Input
                    id="note-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Nhập tiêu đề..."
                    className="border-4 border-black bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note-content" className="text-xs font-bold">Nội dung</Label>
                  <Textarea
                    id="note-content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Nhập nội dung ghi chú..."
                    rows={6}
                    className="border-4 border-black bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCreateOpen(false)}
                    className="border-4 border-black bg-[#fef3c7] shadow-[4px_4px_0_#000] px-4 py-2 text-xs font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all duration-150"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newTitle.trim() || !newContent.trim() || createMutation.isPending}
                    className="bg-[#e11d48] text-white border-4 border-black shadow-[4px_4px_0_#000] px-4 py-2 text-xs font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#000]"
                  >
                    {createMutation.isPending ? 'Đang tạo...' : 'Tạo ghi chú'}
                  </button>
                </div>
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
          className="pl-10 border-4 border-black bg-white shadow-[inset_-3px_-3px_0_#000,inset_3px_3px_0_rgba(0,0,0,0.08)]"
        />
      </div>

      {/* Notes list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 border-4 border-black" />
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
                <Card className="border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] bg-[#fef3c7] hover:shadow-[inset_-6px_-6px_0_#000,inset_6px_6px_0_#fff] transition-all duration-200 group">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center border-3 border-black bg-emerald-100 shrink-0 mt-0.5">
                        <FileText className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm">{note.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1 border-3 border-black bg-white px-2 py-0.5 font-bold">
                            <Calendar className="h-3 w-3" />
                            {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                          </span>
                          {note.lessonId && (
                            <span className="text-[10px] border-3 border-black shadow-[2px_2px_0_#000] bg-[#fef3c7] px-2 py-0.5 font-bold">
                              Đã liên kết bài học
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-700 flex items-center justify-center border-3 border-transparent hover:border-black"
                        onClick={() => deleteMutation.mutate(note.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Xóa</span>
                      </button>
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
          <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-[#fef3c7] shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] text-3xl mb-4">
            📝
          </div>
          <h3
            className="font-bold text-base"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px' }}
          >
            {searchTerm ? 'Không tìm thấy ghi chú' : 'Chưa có ghi chú nào'}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            {searchTerm
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Tạo ghi chú đầu tiên để ghi lại những kiến thức quan trọng'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-4 gap-2 flex items-center bg-[#e11d48] text-white border-4 border-black shadow-[4px_4px_0_#000] px-4 py-2 text-xs font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all duration-150"
            >
              <Plus className="h-4 w-4" />
              Tạo ghi chú
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
