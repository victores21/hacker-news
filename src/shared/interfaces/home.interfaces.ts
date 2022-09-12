export interface News {
  author: string;
  created_at: string;
  objectID: string;
  story_title: string;
  story_url: string;
  is_liked: boolean;
}

export interface SelectOption {
  value: string;
  label: JSX.Element;
}
