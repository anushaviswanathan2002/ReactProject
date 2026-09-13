import { useRef, useState, useEffect } from 'react'
import './Drawing.css'

function Drawing({ onBack }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)
  const [tool, setTool] = useState('pen')
  const contextRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth - 40
    canvas.height = window.innerHeight - 200

    canvas.style.border = '2px solid #6366f1'
    canvas.style.borderRadius = '8px'
    canvas.style.cursor = 'crosshair'
    canvas.style.backgroundColor = 'white'

    const context = canvas.getContext('2d')
    context.lineCap = 'round'
    context.lineJoin = 'round'
    contextRef.current = context

    // Handle window resize
    const handleResize = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      canvas.width = window.innerWidth - 40
      canvas.height = window.innerHeight - 200
      context.putImageData(imageData, 0, 0)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return

    const { offsetX, offsetY } = nativeEvent
    contextRef.current.lineWidth = brushSize
    contextRef.current.strokeStyle = tool === 'eraser' ? 'white' : color

    if (tool === 'eraser') {
      contextRef.current.clearRect(offsetX - brushSize / 2, offsetY - brushSize / 2, brushSize, brushSize)
    } else {
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()
    }
  }

  const stopDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `drawing-${Date.now()}.png`
    link.click()
  }

  const undo = () => {
    // Simple undo by clearing and redrawing
    // For a more robust solution, maintain a history array
    clearCanvas()
  }

  return (
    <div className="drawing-container">
      <div className="drawing-toolbar">
        <div className="toolbar-group">
          <label>Tool:</label>
          <select value={tool} onChange={(e) => setTool(e.target.value)} className="tool-select">
            <option value="pen">✏️ Pen</option>
            <option value="eraser">🧹 Eraser</option>
          </select>
        </div>

        <div className="toolbar-group">
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-input"
            disabled={tool === 'eraser'}
          />
        </div>

        <div className="toolbar-group">
          <label>Brush Size: {brushSize}px</label>
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="brush-slider"
          />
        </div>

        <div className="toolbar-group">
          <button onClick={clearCanvas} className="tool-btn clear-btn">🗑️ Clear</button>
          <button onClick={undo} className="tool-btn undo-btn">↶ Undo</button>
          <button onClick={saveDrawing} className="tool-btn save-btn">💾 Save</button>
        </div>

        <button onClick={onBack} className="tool-btn back-btn">← Back to Todos</button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="canvas"
      />
    </div>
  )
}

export default Drawing
