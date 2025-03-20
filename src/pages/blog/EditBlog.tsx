import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Blog } from '../../components/blog/BlogPost';

interface BlogFormData {
  title: string;
  content: string;
}

const EditBlog: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get<Blog>(`http://localhost:8080/api/blogs/${id}`);
        setBlog(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || '블로그 정보를 불러오는데 실패했습니다.');
        } else {
          setError('블로그 정보를 불러오는데 실패했습니다.');
        }
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/blogs/${id}`,
        {
          title: formData.title,
          content: formData.content,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        navigate('/blog');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '블로그 수정에 실패했습니다. 다시 시도해주세요.');
      } else {
        setError('블로그 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!blog) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">블로그를 찾을 수 없습니다.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          블로그 수정
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="제목"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="내용"
            name="content"
            value={formData.content}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={10}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/blog')}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.title || !formData.content}
            >
              수정하기
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditBlog; 