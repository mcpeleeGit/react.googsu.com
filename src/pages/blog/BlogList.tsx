import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BlogPost from '../../components/blog/BlogPost';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError('게시글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          블로그
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/blog/new')}
        >
          새 글 작성
        </Button>
      </Box>
      {posts.map((post) => (
        <BlogPost
          key={post.id}
          {...post}
          onDelete={() => handleDelete(post.id)}
          onEdit={() => navigate(`/blog/edit/${post.id}`)}
        />
      ))}
    </Container>
  );
};

export default BlogList; 