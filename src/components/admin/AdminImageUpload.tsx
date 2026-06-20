import { useId, useRef, useState, type ChangeEvent } from 'react'
import { uploadProductImage } from '../../api/admin'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Button } from '../primitives'

const ACCEPT = 'image/jpeg,image/png,image/webp'

interface AdminImageUploadProps {
  productId: string
  onUploaded: (result: { url: string; id: number }) => void
  label?: string
}

export function AdminImageUpload({
  productId,
  onUploaded,
  label = 'Upload photo',
}: AdminImageUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const { token } = useAdminAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setError(null)
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return URL.createObjectURL(selected)
    })
  }

  async function handleUpload() {
    if (!file || !token) return

    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadProductImage(token, productId, file)
      onUploaded(result)
      setFile(null)
      setPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3 border border-cream/20 bg-obsidian p-4">
      <label
        htmlFor={inputId}
        className="block font-mono text-sm uppercase tracking-widest text-cream/80"
      >
        {label}
      </label>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFileChange}
        className="block w-full font-mono text-sm text-cream/80 file:mr-4 file:border file:border-cream/30 file:bg-charcoal file:px-4 file:py-2 file:font-mono file:text-sm file:uppercase file:tracking-widest file:text-cream hover:file:border-gold hover:file:text-gold"
      />

      {preview && (
        <img
          src={preview}
          alt=""
          className="h-24 w-24 border border-cream/30 object-cover"
        />
      )}

      <Button
        type="button"
        size="default"
        onClick={() => void handleUpload()}
        disabled={!file || isUploading || !token}
      >
        {isUploading ? 'Uploading…' : 'Upload'}
      </Button>

      {error && (
        <p className="font-mono text-sm text-gold" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
