import useComponents from "..";
import "./newsCard.css";

interface Props {
  isFavorite: boolean;
}

const NewsCard: React.FC<Props> = ({ isFavorite }) => {
  const { HeartIcon, ClockIcon } = useComponents();

  return (
    <div className="news-card">
      <div className="news-card__content">
        <a href="https://www.google.com" target="_blank" rel="noreferrer">
          <div className="news-card__date">
            <div className="news-card__date-icon">
              <ClockIcon />
            </div>
            3 hours ago by Author
          </div>
          <h2 className="news-card__title">
            Yes, React is taking over front-end development. The question is why
          </h2>
        </a>
      </div>
      <div className="news-card__fav-button">
        <button className="fav-button">
          <HeartIcon isFavorite={isFavorite} />
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
