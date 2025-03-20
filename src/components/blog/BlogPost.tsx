import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import axios from 'axios';

export interface Blog {
  id: number;
  title: string;
  content: string;
  memberId: number;
  memberName: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostProps {
  blog: Blog;
}

const BlogPost: React.FC<BlogPostProps> = ({ blog }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleEdit = () => {
    navigate(`/blog/edit/${blog.id}`);
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
        `http://localhost:8080/api/blogs/${blog.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/blog/member/${blog.memberId}`);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            작성자:{' '}
            <Link
              href="#"
              onClick={handleAuthorClick}
              sx={{ textDecoration: 'none' }}
            >
              {blog.memberName}
            </Link>{' '}
            | 작성일: {format(new Date(blog.createdAt), 'PPP', { locale: ko })}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.primary">
          {blog.content.length > 200
            ? `${blog.content.substring(0, 200)}...`
            : blog.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/blog/${blog.id}`)}>
          자세히 보기
        </Button>
        {user.id === blog.memberId && (
          <>
            <Button size="small" onClick={handleEdit}>
              수정
            </Button>
            <Button size="small" color="error" onClick={handleDelete}>
              삭제
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default BlogPost; 