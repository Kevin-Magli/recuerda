import type { Memorial } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    return { id: 'error', url: '', hint: '' };
  }
  return { id: image.id, url: image.imageUrl, hint: image.imageHint };
};

export const memorials: Memorial[] = [
  {
    id: '1',
    slug: 'john-doe',
    name: 'John Doe',
    birthDate: '1950-01-15',
    deathDate: '2024-05-20',
    lifeSpan: '1950 - 2024',
    profileImage: getImage('memorial-1'),
    bio: 'John Doe was a beloved father, husband, and friend. He had a passion for woodworking and spent his free time creating beautiful pieces of furniture. His laughter was infectious, and his kindness touched everyone he met. He will be remembered for his generous spirit and unwavering love for his family.',
    gallery: [
      getImage('gallery-1'),
      getImage('gallery-2'),
      getImage('gallery-3'),
      getImage('gallery-4'),
    ],
    tributes: [
      { id: 't1', author: 'Family', message: 'We will miss you forever. Your memory will live on in our hearts.', date: '2024-05-22' },
      { id: 't2', author: 'A Friend', message: 'John was a true friend. I will cherish the memories of our time together.', date: '2024-05-23' },
    ],
  },
  {
    id: '2',
    slug: 'jane-smith',
    name: 'Jane Smith',
    birthDate: '1962-08-22',
    deathDate: '2023-11-10',
    lifeSpan: '1962 - 2023',
    profileImage: getImage('memorial-2'),
    bio: 'Jane Smith was a brilliant scientist and a loving mother. Her contributions to her field were immense, but her greatest joy was her family. She loved hiking in the mountains and had a deep appreciation for nature. Her wisdom and grace will be deeply missed.',
    gallery: [
      getImage('gallery-5'),
      getImage('gallery-6'),
      getImage('gallery-1'),
      getImage('gallery-2'),
    ],
    tributes: [
      { id: 't3', author: 'Her Children', message: 'Mom, you were our guiding star. We love you more than words can say.', date: '2023-11-12' },
    ],
  },
  {
    id: '3',
    slug: 'robert-brown',
    name: 'Robert Brown',
    birthDate: '1945-03-30',
    deathDate: '2024-01-05',
    lifeSpan: '1945 - 2024',
    profileImage: getImage('memorial-3'),
    bio: 'Robert "Bob" Brown served his country with honor and lived his life with integrity. He was a man of few words but deep feelings. His love for classic cars was matched only by his love for his grandchildren. He was our rock, and his legacy is one of strength and resilience.',
    gallery: [
        getImage('gallery-3'),
        getImage('gallery-4'),
        getImage('gallery-5'),
        getImage('gallery-6'),
    ],
    tributes: [],
  },
  {
    id: '4',
    slug: 'emily-white',
    name: 'Emily White',
    birthDate: '1988-07-19',
    deathDate: '2022-09-15',
    lifeSpan: '1988 - 2022',
    profileImage: getImage('memorial-4'),
    bio: 'Emily White was an artist whose vibrant paintings brought joy to many. Her spirit was as colorful as her canvases. She traveled the world, capturing its beauty in her art and in her heart. Though her life was short, her impact was profound.',
    gallery: [
        getImage('gallery-1'),
        getImage('gallery-3'),
        getImage('gallery-5'),
        getImage('gallery-2'),
    ],
    tributes: [
        { id: 't4', author: 'Art Community', message: 'Emily\'s light will continue to shine through her incredible work.', date: '2022-09-20' },
    ],
  },
  {
    id: '5',
    slug: 'michael-green',
    name: 'Michael Green',
    birthDate: '1975-11-02',
    deathDate: '2024-02-18',
    lifeSpan: '1975 - 2024',
    profileImage: getImage('memorial-5'),
    bio: 'Michael Green was a dedicated teacher who inspired countless students. He believed in the power of education to change lives. He was also a talented musician, playing guitar in a local band. His passion for learning and music was contagious.',
    gallery: [
        getImage('gallery-4'),
        getImage('gallery-6'),
        getImage('gallery-1'),
        getImage('gallery-3'),
    ],
    tributes: [
      { id: 't5', author: 'Former Student', message: 'Mr. Green was the best teacher I ever had. He changed my life.', date: '2024-02-20' },
    ],
  },
  {
    id: '6',
    slug: 'sarah-black',
    name: 'Sarah Black',
    birthDate: '1955-06-12',
    deathDate: '2023-12-30',
    lifeSpan: '1955 - 2023',
    profileImage: getImage('memorial-6'),
    bio: 'Sarah Black was a pillar of her community, known for her tireless volunteer work and her famous baked goods. Her home was always open to those in need. She had a heart of gold and a smile that could light up any room. She was the embodiment of generosity.',
    gallery: [
        getImage('gallery-2'),
        getImage('gallery-4'),
        getImage('gallery-6'),
        getImage('gallery-5'),
    ],
    tributes: [],
  },
  {
    id: '7',
    slug: 'david-gray',
    name: 'David Gray',
    birthDate: '1992-09-01',
    deathDate: '2024-04-01',
    lifeSpan: '1992 - 2024',
    profileImage: getImage('memorial-7'),
    bio: 'David Gray was an adventurer and a dreamer. He climbed mountains, sailed oceans, and lived life to the fullest. He had an insatiable curiosity and a kind soul. His stories and his spirit of adventure will never be forgotten.',
    gallery: [
        getImage('gallery-6'),
        getImage('gallery-1'),
        getImage('gallery-2'),
        getImage('gallery-3'),
    ],
    tributes: [
        { id: 't6', author: 'Travel Companion', message: 'Every journey with David was an adventure. The world is a little less bright without him.', date: '2024-04-05' },
    ],
  },
  {
    id: '8',
    slug: 'laura-blue',
    name: 'Laura Blue',
    birthDate: '1980-02-25',
    deathDate: '2023-10-22',
    lifeSpan: '1980 - 2023',
    profileImage: getImage('memorial-8'),
    bio: 'Laura Blue was a compassionate nurse who dedicated her life to caring for others. Her gentle touch and reassuring words brought comfort to countless patients. Outside of work, she was a passionate gardener, and her garden was a place of peace and beauty.',
    gallery: [
        getImage('gallery-1'),
        getImage('gallery-2'),
        getImage('gallery-3'),
        getImage('gallery-4'),
    ],
    tributes: [],
  },
];
