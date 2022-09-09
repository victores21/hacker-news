import { useEffect, useState } from "react";
import "./Home.css";
import IconAngular from "../../assets/images/icon_angular.png";
import IconReact from "../../assets/images/icon_react.png";
import IconVue from "../../assets/images/icon_vue.png";
import useComponents from "../../components";
import useServices from "../../api/services";
import Select from "react-select";
import moment from "moment";

interface News {
  author: string;
  comment_text: string;
  created_at: string;
  created_at_i: number;
  num_comments: any;
  objectID: string;
  parent_id: number;
  points: any;
  story_id: number;
  story_text: any;
  story_title: string;
  story_url: string;
  title: any;
  url: any;
  _highlightResult: object;
  _tags: Array<string>;
}

const Home = () => {
  const { NewsCard, Header } = useComponents();
  const { getNewsByTechnology } = useServices();
  const options = [
    {
      value: "angular",
      label: (
        <div className="select-option">
          <img src={IconAngular} alt="" />
          Angular
        </div>
      ),
    },
    {
      value: "react",
      label: (
        <div className="select-option">
          <img src={IconReact} alt="" />
          React
        </div>
      ),
    },
    {
      value: "vue",
      label: (
        <div className="select-option">
          <img src={IconVue} alt="" />
          React
        </div>
      ),
    },
  ];

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<News[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectOption, setSelectOption] = useState<string>(options[0].value);

  const handleAddFavorite = (id: string) => {
    const newInfo = news.filter(
      (newInfo) => newInfo.objectID === id.toString()
    )[0];
    setFavorites([...favorites, newInfo]);
    localStorage.setItem("favorites", JSON.stringify([...favorites, newInfo]));
  };

  const handleRemoveFavorite = (id: string) => {
    const newFavorites = favorites.filter(
      (favorite) => favorite.story_id.toString() !== id.toString()
    );

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleActiveCategory = (category: string) => {
    setActiveCategory(category);
  };

  const handleFavoriteLocalStorage = () => {
    if (localStorage.getItem("favorites")) {
      const favoritesLocalStorage: string | null =
        localStorage.getItem("favorites");
      const arrFavoritesLocalStorage: News[] = favoritesLocalStorage
        ? JSON.parse(favoritesLocalStorage)
        : "";

      setFavorites(arrFavoritesLocalStorage);
    }
  };

  const handleSelect = (selectValue: string) => {
    setSelectOption(selectValue);
    setLoading(true);
    getNewsByTechnology(selectValue, 0)
      .then((res) => {
        setNews(res.hits);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw new Error(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    getNewsByTechnology("angular", 0)
      .then((res) => {
        setNews(res.hits);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw new Error(error);
      });
  }, []);

  useEffect(() => {
    handleFavoriteLocalStorage();
  }, []);

  return (
    <div>
      <Header />

      <div className="content">
        <div className="center">
          {/* Categories */}
          <div className="categories">
            <div
              className={`category ${
                activeCategory === "all" && "category--active"
              }`}
              onClick={() => handleActiveCategory("all")}
            >
              All
            </div>
            <div
              className={`category ${
                activeCategory === "favorites" && "category--active"
              }`}
              onClick={() => handleActiveCategory("favorites")}
            >
              My Faves
            </div>
          </div>
          {/* Selector */}
          <div className="select-box">
            <Select
              options={options}
              defaultValue={options[0]}
              onChange={(evt: any) => handleSelect(evt.value)}
            />
          </div>
          {/* Card list */}
          {activeCategory === "all" && (
            <ul className="news-card-list news-list">
              {loading && "Loading..."}
              {!loading && (
                <>
                  {news.map((newsInfo) => (
                    <li key={newsInfo.objectID}>
                      <NewsCard
                        isFavorite={false}
                        author={newsInfo.author}
                        date={moment(news[0].created_at).fromNow()}
                        title={newsInfo.story_title}
                        newsUrl={newsInfo.story_url}
                        onClickFavorite={() =>
                          handleAddFavorite(newsInfo.objectID)
                        }
                      />
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}

          {/* Favorite List */}
          {activeCategory === "favorites" && (
            <ul className="news-card-list news-list">
              {loading && "Loading..."}
              {!loading && (
                <>
                  {favorites.map((favoriteNew: News) => (
                    <li key={favoriteNew.objectID}>
                      <NewsCard
                        isFavorite={true}
                        author={favoriteNew.author}
                        date={moment(news[0].created_at).fromNow()}
                        title={favoriteNew.story_title}
                        newsUrl={favoriteNew.story_title}
                        onClickFavorite={() =>
                          handleRemoveFavorite(favoriteNew.story_id.toString())
                        }
                      />
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
