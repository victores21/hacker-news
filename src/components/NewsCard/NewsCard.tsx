import useComponents from "..";
import { useState } from "react";
import "./newsCard.css";

interface Props {
  isFavorite: boolean;
  author: string;
  date: string;
  title: string;
  newsUrl: string;
  onClickFavorite: () => void;
}

const NewsCard: React.FC<Props> = ({
  isFavorite,
  author,
  date,
  title,
  newsUrl,
  onClickFavorite,
}) => {
  const { HeartIcon, ClockIcon } = useComponents();
  const [isLike, setIsLike] = useState<boolean>(isFavorite);

  const handleisLike = () => {
    setIsLike(!isLike);
  };

  return (
    <div className="news-card">
      <div className="news-card__content">
        <a href={newsUrl} target="_blank" rel="noreferrer">
          <div className="news-card__date">
            <div className="news-card__date-icon">
              <ClockIcon />
            </div>
            {date} by {author}
          </div>
          <h2 className="news-card__title">{title}</h2>
        </a>
      </div>
      <div className="news-card__fav-button" onClick={() => handleisLike()}>
        <button className="fav-button" onClick={onClickFavorite}>
          <HeartIcon isFavorite={isLike} />
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
