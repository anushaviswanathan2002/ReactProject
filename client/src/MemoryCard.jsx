export function MemoryCard({ memory, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="memory-card">
      <h3>{memory.title}</h3>
      <p>{memory.content}</p>
      <div className="date">{formatDate(memory.createdAt)}</div>
      <div className="memory-card-actions">
        <button className="edit-btn" onClick={() => onEdit(memory)}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(memory.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
