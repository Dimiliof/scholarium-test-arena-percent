
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Reply {
  id: number;
  author: string;
  date: string;
  content: string;
}

interface ForumPost {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  replies: Reply[];
}

interface ForumPostListProps {
  posts: ForumPost[];
}

const ForumPostList: React.FC<ForumPostListProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Δεν υπάρχουν αναρτήσεις ακόμα.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString('el-GR')}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Από: {post.author}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="whitespace-pre-line">{post.content}</p>
          </CardContent>
          <CardFooter className="bg-muted/20 flex justify-between items-center border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> {post.replies.length} απαντήσεις
            </div>
            <Link to={`/forum/post/${post.id}`}>
              <Button variant="outline" size="sm">
                Προβολή συζήτησης
              </Button>
            </Link>
          </CardFooter>
          
          {/* Show first reply if it exists */}
          {post.replies.length > 0 && (
            <div className="border-t px-6 py-4 bg-muted/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{post.replies[0].author}</span>
                <span className="text-muted-foreground">{new Date(post.replies[0].date).toLocaleDateString('el-GR')}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.replies[0].content}</p>
              {post.replies.length > 1 && (
                <p className="text-xs text-muted-foreground mt-2">
                  + {post.replies.length - 1} ακόμα {post.replies.length - 1 === 1 ? 'απάντηση' : 'απαντήσεις'}
                </p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ForumPostList;
