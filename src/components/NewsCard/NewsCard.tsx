import useComponents from "..";
// import { useState } from "react";
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
      <div className="news-card__fav-button" onClick={onClickFavorite}>
        <button className="fav-button">
          <HeartIcon isFavorite={isFavorite} />
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
