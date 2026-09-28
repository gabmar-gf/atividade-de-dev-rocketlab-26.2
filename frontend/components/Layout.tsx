import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Film,
  BookmarkCheck,
  FolderPlus,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: sidebarOpen ? '12px' : '0',
    justifyContent: sidebarOpen ? 'flex-start' : 'center',
    padding: '12px 16px',
    color: isActive ? '#00e054' : '#9ab',
    backgroundColor: isActive ? '#2c3440' : 'transparent',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  });

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#14181c',
        color: '#fff',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '240px' : '72px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          padding: '24px 12px',
          backgroundColor: '#1b2228',
          borderRight: '1px solid #2c3440',
          boxSizing: 'border-box',
          transition: 'width 0.2s ease-in-out',
          zIndex: 100,
        }}
      >
        {/* Cabeçalho da Sidebar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'space-between' : 'center',
            marginBottom: '32px',
            minHeight: '32px',
          }}
        >
          {sidebarOpen && (
            <h2
              style={{
                margin: '0 0 0 8px',
                color: '#00e054',
              }}
            >
              Menu
            </h2>
          )}

          <button
            onClick={() => setSidebarOpen((open) => !open)}
            title={sidebarOpen ? 'Recolher menu' : 'Expandir menu'}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              backgroundColor: '#2c3440',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <NavLink
            to="/movies"
            style={linkStyle}
            title={!sidebarOpen ? 'Catálogo' : undefined}
          >
            <Film size={20} />
            {sidebarOpen && 'Catálogo'}
          </NavLink>

          <NavLink
            to="/movies/added"
            style={(props) => ({
              ...linkStyle(props),
              fontSize: '14px',
            })}
            title={!sidebarOpen ? 'Filmes Adicionados' : undefined}
          >
            <FolderPlus size={20} />
            {sidebarOpen && 'Filmes Adicionados'}
          </NavLink>

          <NavLink
            to="/watchlist"
            style={linkStyle}
            title={!sidebarOpen ? 'Minha Lista' : undefined}
          >
            <BookmarkCheck size={20} />
            {sidebarOpen && 'Minha Lista'}
          </NavLink>

          <NavLink
            to="/ratings"
            style={linkStyle}
            title={!sidebarOpen ? 'Avaliações' : undefined}
          >
            <Star size={20} />
            {sidebarOpen && 'Avaliações'}
          </NavLink>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main
        style={{
          marginLeft: sidebarOpen ? '240px' : '72px',
          flex: 1,
          minHeight: '100vh',
          padding: '24px',
          boxSizing: 'border-box',
          transition: 'margin-left 0.2s ease-in-out',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};