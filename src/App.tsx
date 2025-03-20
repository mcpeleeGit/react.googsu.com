import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import SignUpPage from './pages/auth/SignUp';
import LoginPage from './pages/auth/Login';
import BlogList from './pages/blog/BlogList';
import CreateBlog from './pages/blog/CreateBlog';
import EditBlog from './pages/blog/EditBlog';
import BlogDetail from './pages/blog/BlogDetail';
import MemberBlogList from './pages/blog/MemberBlogList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/create" element={<CreateBlog />} />
          <Route path="/blog/edit/:id" element={<EditBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blog/member/:memberId" element={<MemberBlogList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 