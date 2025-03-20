import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface BlogPostProps {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  onDelete: (id: number) => void;
}

const BlogPost: React.FC<BlogPostProps> = ({
  id,
  title,
  content,
  author,
  createdAt,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(id);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleAuthorClick = () => {
    navigate(`/blog/member/${author.id}`);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {content}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ cursor: 'pointer' }}
            onClick={handleAuthorClick}
          >
            작성자: {author.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}
          </Typography>
        </Box>
      </CardContent>
      {user && user.id === author.id && (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => navigate(`/blog/edit/${id}`)}
          >
            수정
          </Button>
          <Button
            size="small"
            color="error"
            onClick={handleDeleteClick}
          >
            삭제
          </Button>
        </CardActions>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>블로그 포스트 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            정말로 이 블로그 포스트를 삭제하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BlogPost; 