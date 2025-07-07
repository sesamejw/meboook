import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand href="#" className="d-flex align-items-center">
          <BookOpen className="me-2" size={24} />
          Book Store
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Item className="d-flex align-items-center me-3">
              <User size={18} className="me-2" />
              <span className="text-muted">Welcome, {getUserDisplayName()}</span>
            </Nav.Item>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <LogOut size={16} className="me-1" />
              Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;