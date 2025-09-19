import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [fullImage, setFullImage] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const { isAdmin } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generate 50x50 thumbnail
  const createThumbnail = (dataUrl: string, size = 50): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));

          const srcSize = Math.min(img.width, img.height);
          const sx = (img.width - srcSize) / 2;
          const sy = (img.height - srcSize) / 2;

          ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, size, size);
          const thumbDataUrl = canvas.toDataURL('image/png');
          resolve(thumbDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = dataUrl;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFullImage(null);
      setThumbnail(null);
      return;
    }

    const maxSizeMB = 10;
    if (file.size / 1024 / 1024 > maxSizeMB) {
      toast.error(`Image too large. Max ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setFullImage(dataUrl);
      try {
        const thumb = await createThumbnail(dataUrl, 50);
        setThumbnail(thumb);
      } catch (err) {
        console.error('Thumbnail creation failed', err);
        toast.error('Failed to create thumbnail from selected image.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFullImage(null);
    setThumbnail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // If no uploaded image, fall back to default-profile.png
      let imageToSend = thumbnail;
      let fullImageToSend = fullImage;

      if (!thumbnail || !fullImage) {
        const defaultPath = '/default-profile.png';
        const defaultImg = await fetch(defaultPath).then((res) => res.blob());
        const reader = new FileReader();

        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = async () => {
            const dataUrl = reader.result as string;
            try {
              const thumb = await createThumbnail(dataUrl, 50);
              imageToSend = thumb;
              fullImageToSend = dataUrl;
              resolve(dataUrl);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(defaultImg);
        });

        await base64Promise;
      }

      const payload = {
        ...form,
        image: imageToSend,
        full_image: fullImageToSend,
      };

      await authService.register(payload);
      toast.success('User successfully created!');
      setForm({ username: '', email: '', password: '', role: 'user' });
      setFullImage(null);
      setThumbnail(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create user';
      toast.error(errorMessage);
    }
  };

  if (!isAdmin) return <p>Access Denied</p>;

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: '600px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Create New User</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="engr">Engineer</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="profileImage" className="form-label">Profile Image (optional)</label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
          {thumbnail && (
            <div className="mt-2 d-flex align-items-center">
              <img
                src={thumbnail}
                alt="thumbnail"
                width={50}
                height={50}
                style={{ objectFit: 'cover', borderRadius: 4, marginRight: 8 }}
              />
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleRemoveImage}>
                Remove Image
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-success text-white">
          Create User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
