import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Pagination,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BlogPost from '../../components/blog/BlogPost';
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

const MemberBlogList: React.FC = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const { token } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [memberName, setMemberName] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/blogs/member/${memberId}?page=${page - 1}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const fetchMemberName = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMemberName(response.data.name);
    } catch (error) {
      setMemberName('알 수 없는 사용자');
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchMemberName();
  }, [page, memberId, token]);

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
        <Typography variant="h4" component="h1" gutterBottom>
          {memberName}의 블로그
        </Typography>
        {blogs.map((blog) => (
          <BlogPost
            key={blog.id}
            id={blog.id}
            title={blog.title}
            content={blog.content}
            author={blog.author}
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

export default MemberBlogList; 