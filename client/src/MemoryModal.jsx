import { useState, useEffect } from 'react';

export function MemoryModal({ memory, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
    }
  }, [memory]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({ title, content });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{memory ? 'Edit Memory' : 'Add New Memory'}</h3>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Memory title..."
            className="form-group-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your memory here..."
          />
        </div>
        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSave}>
            {memory ? 'Update' : 'Save'}
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
