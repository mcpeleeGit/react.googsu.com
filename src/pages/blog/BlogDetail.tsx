import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import axios from 'axios';
import { Blog } from '../../components/blog/BlogPost';

const BlogDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Blog>(`http://localhost:8080/api/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || '블로그를 불러오는데 실패했습니다.');
        } else {
          setError('블로그를 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleEdit = () => {
    navigate(`/blog/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await axios.delete(
        `http://localhost:8080/api/blogs/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate('/blog');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || '블로그를 찾을 수 없습니다.'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {blog.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            작성자: {blog.memberName} | 작성일: {format(new Date(blog.createdAt), 'PPP', { locale: ko })}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {blog.content}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/blog')}>
            목록으로
          </Button>
          {user.id === blog.memberId && (
            <>
              <Button variant="contained" onClick={handleEdit}>
                수정
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                삭제
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogDetail; 