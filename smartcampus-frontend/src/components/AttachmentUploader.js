import React, { useRef } from 'react';

/* ════════════════════════════════════
   AttachmentUploader
   props:
     images  – File[] state
     setImages – setter
════════════════════════════════════ */
function AttachmentUploader({ images, setImages }) {
  const inputRef = useRef(null);
  const MAX = 3;

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX - images.length;
    if (remaining <= 0) {
      alert('Maximum 3 images allowed.');
      return;
    }
    const toAdd = files.slice(0, remaining).filter(f => f.type.startsWith('image/'));
    setImages(prev => [...prev, ...toAdd]);
    // reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {images.length < MAX && (
        <div
          className="upload-zone"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            style={{ display: 'none' }}
          />
          <div className="upload-zone-icon">📎</div>
          <p>Click or drag images here</p>
          <small>{images.length}/{MAX} images added · PNG, JPG, WEBP</small>
        </div>
      )}

      {images.length > 0 && (
        <div className="image-previews">
          {images.map((file, idx) => (
            <div key={idx} className="image-preview-item">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx + 1}`}
              />
              <button
                className="remove-img-btn"
                type="button"
                onClick={() => handleRemove(idx)}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttachmentUploader;
