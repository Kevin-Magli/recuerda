export type Memorial = {
  id: string;
  slug: string;
  name: string;
  birthDate: string;
  deathDate: string;
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
