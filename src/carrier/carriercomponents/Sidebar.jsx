import React from 'react';

const Sidebar = ({ active, onNavigate }) => {
  const items = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'education', label: 'Education' },
    { id: 'professional', label: 'Professional Details' },
    { id: 'review', label: 'Review & Submit' }
  ];

  return (
    <nav className="sidebar-employee">
      {items.map((it) => (
        <div
          key={it.id}
          className={`nav-item ${active === it.id ? 'active' : ''}`}
          onClick={() => onNavigate(it.id)}
        >
          {it.label}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
