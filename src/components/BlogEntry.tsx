import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpotify } from "./Player";
import { Button } from "@/components/ui/button";

interface BlogProps {
  title: string;
  content: string;
  trackId: string;
}

export const BlogEntry: React.FC<BlogProps> = ({
  title,
  content,
  trackId,
}: BlogProps) => {
  const spotify = useSpotify();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <Button onClick={() => spotify?.play(trackId)}>Play</Button>
      </CardContent>
    </Card>
  );
};
