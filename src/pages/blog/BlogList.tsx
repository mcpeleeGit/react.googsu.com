import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Pagination,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogPost from '../../components/blog/BlogPost';
import { useAuth } from '../../contexts/AuthContext';

interface Blog {
  id: number;
  title: string;
  content: string;
  memberId: number;
  memberName: string;
  createdAt: string;
}

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/blogs?page=${page - 1}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('API Response:', response.data);
      setBlogs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError('블로그 목록을 불러오는데 실패했습니다.');
      setSnackbar({
        open: true,
        message: '블로그 목록을 불러오는데 실패했습니다.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, token]);

  const handleDelete = async (id: number) => {
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
      fetchBlogs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '블로그 포스트 삭제에 실패했습니다.',
        severity: 'error',
      });
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            블로그 목록
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/blog/create')}
          >
            새 글 작성
          </Button>
        </Box>
        {blogs.map((blog) => (
          <BlogPost
            key={blog.id}
            id={blog.id}
            title={blog.title}
            content={blog.content}
            author={{
              id: blog.memberId,
              name: blog.memberName,
            }}
            createdAt={blog.createdAt}
            onDelete={handleDelete}
          />
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
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

export default BlogList; 