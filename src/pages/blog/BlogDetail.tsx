import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface Blog {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
}

const BlogDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(response.data);
      } catch (error) {
        setError('블로그 포스트를 불러오는데 실패했습니다.');
        setSnackbar({
          open: true,
          message: '블로그 포스트를 불러오는데 실패했습니다.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbar({
        open: true,
        message: '블로그 포스트가 성공적으로 삭제되었습니다.',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/blog');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: '블로그 포스트 삭제에 실패했습니다.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container>
        <Alert severity="error">{error || '블로그 포스트를 찾을 수 없습니다.'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {blog.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/blog/member/${blog.author.id}`)}
            >
              작성자: {blog.author.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(blog.createdAt), 'yyyy-MM-dd HH:mm')}
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {blog.content}
          </Typography>
          {user && user.id === blog.author.id && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/blog/edit/${id}`)}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogDetail; 