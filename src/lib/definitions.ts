export type Memorial = {
  id: string;
  authorId: string;
  name: string;
  lifeSpan: string;
  createdAt: any;
  profileImage?: {
    url: string;
    hint: string;
  };
  bio?: string;
  gallery?: { id: string; url: string; hint: string }[];
  tributes?: { id: string; author: string; message: string; date: string }[];
};
