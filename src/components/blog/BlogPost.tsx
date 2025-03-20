import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface BlogPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({
  id,
  title,
  content,
  author,
  createdAt,
  onEdit,
  onDelete,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={title}
        subheader={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">
              작성자: {author}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {format(new Date(createdAt), 'PPP', { locale: ko })}
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <Typography variant="body1" color="text.primary">
          {content}
        </Typography>
      </CardContent>
      {(onEdit || onDelete) && (
        <CardActions>
          {onEdit && (
            <Button size="small" onClick={onEdit}>
              수정
            </Button>
          )}
          {onDelete && (
            <Button size="small" color="error" onClick={onDelete}>
              삭제
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default BlogPost; 