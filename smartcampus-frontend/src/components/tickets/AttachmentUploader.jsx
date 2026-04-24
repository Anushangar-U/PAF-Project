import React, { useRef } from 'react';
import { MAX_ATTACHMENTS } from '../../utils/constants';

/**
 * AttachmentUploader
 * Props:
 *   images   – File[]   current image array (state owned by parent)
 *   setImages – setter
 */
function AttachmentUploader({ images, setImages }) {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files     = Array.from(e.target.files);
    const remaining = MAX_ATTACHMENTS - images.length;
    if (remaining <= 0) {
      alert(`Maximum ${MAX_ATTACHMENTS} images allowed.`);
      return;
    }
    const toAdd = files
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);
    setImages((prev) => [...prev, ...toAdd]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      {images.length < MAX_ATTACHMENTS && (
        <div
          className="upload-zone"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
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
          <small>
            {images.length}/{MAX_ATTACHMENTS} images added · PNG, JPG, WEBP
          </small>
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
