export default interface ProductProp {
    id: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    category: {
      id: number;
      name: string;
      slug: string;
      image: string;
    };
    images: string[];
  }
