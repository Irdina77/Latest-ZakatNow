import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarDrawer from '../components/SidebarDrawer';
import { UserRound } from 'lucide-react';
import '../Styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userData, setUserData] = useState({ fullName: '', email: '', role: 'user', avatarUrl: '' });
  const [tempPassword, setTempPassword] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const current = users.find((user) => user.email === email);
    if (current) {
      setUserData({
        fullName: current.fullName || current.username || '',
        email: current.email || '',
        role: current.role || 'user',
        avatarUrl: current.avatarUrl || ''
      });
    }
  }, []);

  const handleSave = () => {
    if (!userData.fullName.trim() || !userData.email.trim()) {
      alert('Full name and email are required.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const currentEmail = localStorage.getItem('userEmail');
    const currentIndex = users.findIndex((user) => user.email === currentEmail);
    const duplicateIndex = users.findIndex(
      (user) => user.email === userData.email && user.email !== currentEmail
    );

    if (duplicateIndex >= 0) {
      alert('This email is already registered.');
      return;
    }

    if (currentIndex >= 0) {
      users[currentIndex] = {
        ...users[currentIndex],
        fullName: userData.fullName,
        email: userData.email,
        password: tempPassword || users[currentIndex].password,
        avatarUrl: userData.avatarUrl
      };
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      localStorage.setItem('userEmail', userData.email);
      alert('Profile updated successfully');
      navigate('/dashboard');
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserData((prev) => ({ ...prev, avatarUrl: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="profile-page">
        <header className="profile-topbar">
          <button
            className="profile-menu-trigger"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
          <div className="profile-topbar-title">
            <h1>Profile</h1>
            <p>View and update your account settings anytime.</p>
          </div>
        </header>

        <main className="profile-main">
          <div className="profile-card">
            <div className="profile-preview">
              {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt="Profile avatar" className="profile-image" />
              ) : (
                <div className="profile-placeholder"><UserRound size={36} strokeWidth={2} /></div>
              )}
              <label className="profile-upload-label">
                Change Image
                <input type="file" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="profile-form">
              <label>Full Name</label>
              <input
                type="text"
                value={userData.fullName}
                onChange={(e) => setUserData((prev) => ({ ...prev, fullName: e.target.value }))}
              />

              <label>Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
              />

              <label>Password</label>
              <input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter new password"
              />

              <label>User Role</label>
              <input type="text" value={userData.role} readOnly />

              <div className="profile-actions">
                <button className="profile-btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
                <button className="profile-btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <SidebarDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
