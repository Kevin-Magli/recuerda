export type Memorial = {
  id: string;
  name: string;
  lifeSpan: string;
  profileImage: {
    id: string,
    url: string,
    hint: string,
  };
  bio: string;
  gallery: {
    id: string,
    url: string,
    hint: string,
  }[];
  tributes: {
    id: string;
    author: string;
    message: string;
    date: string;
  }[];
};
