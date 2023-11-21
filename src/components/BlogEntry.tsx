import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogProps {
  title: string;
  content: string;
}

export const BlogEntry: React.FC<BlogProps> = ({
  title,
  content,
}: BlogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};
