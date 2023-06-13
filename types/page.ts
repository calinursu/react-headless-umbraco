interface ILink {
  name?: string;
  target?: string;
  url?: string;
  type?: string;
  icon?: string;
}
interface ILinkGroup {
  name: string;
  items: ILink[];
}

interface IImage {
  alt?: string;
  key?: string;
  name: string;
  url: string;
}

export interface IPageProps {
  layoutData: ILayout;
  content: {};
}

export interface INavItem {
  id?: string;
  items: INavItem[];
  name: string;
  url: string;
  icon?: string;
}

export interface ILayout {
  categories: {
    items: INavItem[];
  };
  footer: IFooter;
  header: {
    logo: IImage;
  };
  primaryMenu: {
    items: INavItem[];
  };
  features: {
    [key: string]: boolean;
  };
}

export interface IFooter {
  bottomText: string;
  items: ILinkGroup[];
  primaryImage: IImage;
  secondaryItems: ILinkGroup;
}
