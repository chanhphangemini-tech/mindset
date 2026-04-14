'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, RotateCcw, Loader2 } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const skillPathOptions = [
  { id: 'tu-duy-he-thong', label: 'Tư duy hệ thống', icon: '🔄' },
  { id: 'phan-bien-thuyet-phuc', label: 'Phản biện & Thuyết phục', icon: '💡' },
  { id: 'quan-tri-ai', label: 'Quản trị AI', icon: '🤖' },
  { id: 'tu-duy-chien-luoc', label: 'Tư duy chiến lược', icon: '♟️' },
]

const suggestedQuestions = [
  'Phân tích cho tôi về vòng lặp phản hồi',
  'Làm sao để nhận diện logical fallacy?',
  'Giải thích về prompt engineering',
  'Sự khác biệt giữa chiến lược và chiến thuật?',
]

export function AIPracticeView() {
  const { currentView } = useAppStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text?: string) => {
    const message = text || input.trim()
    if (!message || isLoading) return

    setInput('')
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: message }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const skillPath = skillPathOptions.find((s) => s.id === selectedSkill)?.label
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          skillPath,
        }),
      })
      const data = await response.json()

      if (data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }])
      } else if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: `Xin lỗi, có lỗi xảy ra: ${data.error}` }])
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Xin lỗi, không thể kết nối đến AI. Vui lòng thử lại.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] lg:h-[calc(100vh-12rem)]">
      {/* Header with skill selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}>
            <Sparkles className="h-5 w-5 text-rose-600" />
            Học cùng AI
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Trò chuyện với trợ lý AI để sâu sắc hiểu biết
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {skillPathOptions.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSelectedSkill(selectedSkill === sp.id ? null : sp.id)}
              className={cn(
                'text-xs px-3 py-1.5 border-4 border-black transition-all duration-150',
                selectedSkill === sp.id
                  ? 'bg-[#e11d48] text-white shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]'
                  : 'bg-[#fef3c7] text-black shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0_#000]'
              )}
            >
              <span className="mr-1">{sp.icon}</span>
              <span className="hidden sm:inline">{sp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] bg-[#fef3c7] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] bg-[#fef3c7] text-3xl mb-4">
                🤖
              </div>
              <h3 className="font-bold text-base" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px' }}>Xin chào! Mình là trợ lý AI</h3>
              <p className="text-sm text-muted-foreground mt-3 max-w-md">
                Hãy đặt câu hỏi về tư duy hệ thống, phản biện, quản trị AI hoặc tư duy chiến lược.
                {selectedSkill && ` Mình sẽ tập trung vào ${skillPathOptions.find(s => s.id === selectedSkill)?.label}.`}
              </p>
              <div className="flex flex-wrap gap-2 mt-6 max-w-lg justify-center">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs border-4 border-black bg-[#fef3c7] shadow-[2px_2px_0_#000] px-3 py-2 text-left hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0_#000] transition-all duration-150"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex h-8 w-8 items-center justify-center border-3 border-black shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff] bg-[#fef3c7] shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-rose-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[85%] sm:max-w-[75%] px-4 py-2.5 text-sm leading-relaxed border-4 border-black',
                        msg.role === 'user'
                          ? 'bg-[#e11d48] text-white shadow-[2px_2px_0_#000]'
                          : 'bg-white shadow-[2px_2px_0_#000]'
                      )}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex h-8 w-8 items-center justify-center border-3 border-black shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff] bg-[#fef3c7] shrink-0 mt-1">
                        <User className="h-4 w-4 text-[#e11d48]" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center border-3 border-black shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff] bg-[#fef3c7] shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-rose-600" />
                  </div>
                  <div className="bg-white border-4 border-black shadow-[2px_2px_0_#000] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Đang suy nghĩ...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t-4 border-black p-3 sm:p-4">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
              className="min-h-[44px] max-h-[120px] resize-none flex-1 border-4 border-black bg-white shadow-[inset_-3px_-3px_0_#000,inset_3px_3px_0_rgba(0,0,0,0.08)]"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                'h-[44px] w-[44px] shrink-0 flex items-center justify-center bg-[#e11d48] text-white border-4 border-black shadow-[4px_4px_0_#000] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
                !isLoading && !(!input.trim()) && 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]'
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Gửi</span>
            </button>
          </div>
          {messages.length > 0 && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setMessages([])}
                className="text-xs text-muted-foreground gap-1.5 px-3 py-1.5 border-4 border-transparent hover:border-black transition-all duration-150 flex items-center"
              >
                <RotateCcw className="h-3 w-3" />
                Bắt đầu cuộc trò chuyện mới
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
