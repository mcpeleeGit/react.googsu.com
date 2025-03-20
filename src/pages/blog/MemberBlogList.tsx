import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BlogPost from '../../components/blog/BlogPost';

interface Blog {
  id: number;
  title: string;
  content: string;
  memberId: number;
  memberName: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogListResponse {
  content: Blog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const MemberBlogList: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [memberName, setMemberName] = useState<string>('');
  const pageSize = 10;

  const fetchBlogs = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await axios.get<BlogListResponse>(
        `http://localhost:8080/api/blogs/member/${memberId}?page=${pageNumber - 1}&size=${pageSize}`
      );
      setBlogs(response.data.content);
      setTotalPages(response.data.totalPages);
      
      // 첫 번째 블로그에서 작성자 이름 가져오기
      if (response.data.content.length > 0) {
        setMemberName(response.data.content[0].memberName);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '블로그 목록을 불러오는데 실패했습니다.');
      } else {
        setError('블로그 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page, memberId]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {memberName}의 블로그
        </Typography>
        <Typography variant="body1" color="text.secondary">
          총 {blogs.length}개의 게시글
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} key={blog.id}>
            <BlogPost blog={blog} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default MemberBlogList; 