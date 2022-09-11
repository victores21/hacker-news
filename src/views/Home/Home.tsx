import { useEffect, useState } from "react";
import "./Home.css";
import IconAngular from "../../assets/images/icon_angular.png";
import IconReact from "../../assets/images/icon_react.png";
import IconVue from "../../assets/images/icon_vue.png";
import useComponents from "../../components";
import useServices from "../../api/services";
import Select from "react-select";
import moment from "moment";

import InfiniteScroll from "react-infinite-scroll-component";

interface News {
  author: string;
  //   comment_text: string;
  created_at: string;
  //   created_at_i: number;
  //   num_comments: any;
  objectID: string;
  //   parent_id: number;
  //   points: any;
  //   story_id: number;
  //   story_text: any;
  story_title: string;
  story_url: string;
  //   title: any;
  //   url: any;
  is_liked: boolean;
  //   _highlightResult: object;
  //   _tags: Array<string>;
}

const Home = () => {
  const { NewsCard, Header } = useComponents();
  const { getNewsByTechnology } = useServices();
  const options: any = [
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
          Vue
        </div>
      ),
    },
  ];

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<News[]>([]);
  const [likedPosts, setLikedPosts] = useState<Array<string>>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pagination, setPagination] = useState<number>(0);
  const [hasMorePaginationNews, setHasMorePaginationNews] =
    useState<boolean>(true);
  const [selectOption, setSelectOption] = useState<string>(options[0].value);

  const fetchMoreData = () => {
    setLoading(true);
    getNewsByTechnology(selectOption, pagination)
      .then((res: any) => {
        if (res.hits.length > 0) {
          setNews([...news, ...res.hits]);
          setLoading(false);
          setPagination((prev) => prev + 1);
          setHasMorePaginationNews(true);
        } else {
          setHasMorePaginationNews(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setHasMorePaginationNews(false);
        throw new Error(error);
      });
  };

  const handleAddFavorite = (id: string) => {
    const newInfo = news.filter(
      (newInfo) => newInfo.objectID === id.toString()
    )[0];

    const isDuplicated = favorites.some(
      (favorite) => favorite.objectID === newInfo.objectID
    );

    if (!isDuplicated) {
      setFavorites([...favorites, { ...newInfo, is_liked: true }]);
      setLikedPosts([...likedPosts, id]);
      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, newInfo])
      );
      localStorage.setItem("liked-posts", JSON.stringify([...likedPosts, id]));
    }
  };

  const handleRemoveFavorite = (id: string) => {
    const newFavorites = favorites.filter(
      (favorite) => favorite.objectID.toString() !== id.toString()
    );
    console.log("newfav", newFavorites);
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
    setHasMorePaginationNews(true);
    setPagination(1);
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
    localStorage.setItem("select-value", selectValue);
  };

  //   const handleSelectValueLocalStorage = () => {
  //     if (localStorage.getItem("select-value")) {
  //       const selectValueLocalStorage: any = localStorage.getItem("select-value");
  //       console.log(selectValueLocalStorage);
  //       setSelectOption(selectValueLocalStorage);
  //     }
  //   };

  const handleLikedPostsLocalStorage = () => {
    if (localStorage.getItem("liked-posts")) {
      const likedPostsLocalStorage: string | null =
        localStorage.getItem("liked-posts") || "";
      setLikedPosts(JSON.parse(likedPostsLocalStorage));
    }
  };

  const getSelectValueFromLocalStorage = () => {
    const selectedOption = options.filter(
      (option: any) => option.value === selectOption
    )[0];
    console.log(selectOption);
    return selectOption;
  };

  const handleIsLiked = (objectID: string) => {
    // if (likedPosts.length > 0)
    if (likedPosts.length > 0) {
      if (likedPosts.includes(objectID)) {
        console.log(objectID);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

    // }
  };

  useEffect(() => {
    handleFavoriteLocalStorage();
    handleLikedPostsLocalStorage();
  }, []);

  useEffect(() => {
    console.log("Liked posts from useEffect", likedPosts);
  }, [likedPosts]);

  useEffect(() => {
    setLoading(true);
    getNewsByTechnology("angular", 0)
      .then((res) => {
        console.log("Liked", handleLikedPostsLocalStorage());
        const arrayFormateado: News[] = res.hits.map((hit) => ({
          objectID: hit.objectID,
          author: hit.author,
          created_at: hit.created_at,
          story_title: hit.story_title,
          story_url: hit.story_url,
          is_liked: handleIsLiked(hit.objectID),
        }));

        console.log(arrayFormateado);
        // setNews(res.hits);
        setNews(arrayFormateado);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw new Error(error);
      });
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

          {selectOption && (
            <div className="select-box">
              <Select
                options={options}
                //   defaultValue={options[1]}
                defaultValue={options[0]}
                onChange={(evt: any) => handleSelect(evt)}
              />
            </div>
          )}

          {/* Card list */}
          {activeCategory === "all" && (
            <div>
              <InfiniteScroll
                dataLength={news.length}
                next={fetchMoreData}
                hasMore={hasMorePaginationNews}
                loader={<div>Loading...</div>}
                className="news-card-list news-list"
              >
                {news.map(
                  (newsInfo, i) =>
                    newsInfo.story_url && (
                      <div className="news-item" key={i}>
                        {newsInfo.objectID}
                        <NewsCard
                          isFavorite={newsInfo.is_liked}
                          author={newsInfo.author}
                          date={moment(newsInfo.created_at).fromNow()}
                          title={newsInfo.story_title}
                          newsUrl={newsInfo.story_url}
                          onClickFavorite={() =>
                            handleAddFavorite(newsInfo.objectID)
                          }
                        />
                      </div>
                    )
                )}
              </InfiniteScroll>
            </div>
          )}

          {activeCategory === "favorites" && (
            <div>
              <InfiniteScroll
                dataLength={favorites.length}
                next={fetchMoreData}
                hasMore={hasMorePaginationNews}
                loader={<div>Loading...</div>}
                className="news-card-list news-list"
              >
                {favorites.map(
                  (newsInfo, i) =>
                    newsInfo.story_url && (
                      <div className="news-item" key={i}>
                        <NewsCard
                          isFavorite={true}
                          author={newsInfo.author}
                          date={moment(newsInfo.created_at).fromNow()}
                          title={newsInfo.story_title}
                          newsUrl={newsInfo.story_url}
                          onClickFavorite={() =>
                            handleRemoveFavorite(newsInfo.objectID)
                          }
                        />
                      </div>
                    )
                )}
              </InfiniteScroll>
            </div>
          )}

          {/* Favorite List */}
          {/* {activeCategory === "favorites" && (
            <ul className="news-card-list news-list">
              {loading && "Loading..."}
              {!loading && (
                <>
                  {favorites.map((favoriteNew: News) => (
                    // <li key={favoriteNew.objectID}>
                    <NewsCard
                      isFavorite={true}
                      author={favoriteNew.author}
                      date={moment(news[0].created_at).fromNow()}
                      title={favoriteNew.story_title}
                      newsUrl={favoriteNew.story_title}
                      onClickFavorite={() =>
                        handleRemoveFavorite(favoriteNew.story_id.toString())
                      }
                      cardKey={favoriteNew.objectID}
                    />
                    // </li>
                  ))}
                </>
              )}
            </ul>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Home;
