import { useEffect, useState } from "react";
import "./Home.css";
import { News, SelectOption } from "../../shared/interfaces/home.interfaces";
import IconAngular from "../../assets/images/icon_angular.png";
import IconReact from "../../assets/images/icon_react.png";
import IconVue from "../../assets/images/icon_vue.png";
import useComponents from "../../components";
import useServices from "../../api/services";
import Select from "react-select";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

const selectOptions: SelectOption[] = [
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

const Home = () => {
  const { NewsCard, Header } = useComponents();
  const { getNewsByTechnology } = useServices();
  // const { useHome } = useScreensControllers();
  // const {
  //   news,
  //   setNews,
  //   favorites,
  //   likedPosts,
  //   activeCategory,
  //   hasMorePaginationNews,
  //   selectOptions,
  //   selectOption,
  //   handleFetchMoreData,
  //   fetchMoreFavorites,
  //   handleAddFavorite,
  //   handleRemoveFavorite,
  //   handleActiveCategory,
  //   handleSelect,
  //   handleLikedPostsLocalStorage,
  //   handleIsLiked,
  //   handleSelectValue,
  // } = useHome();

  const [news, setNews] = useState<News[]>([]);
  const [favorites, setFavorites] = useState<News[]>([]);
  const [likedPosts, setLikedPosts] = useState<Array<string>>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pagination, setPagination] = useState<number>(0);
  const [hasMorePaginationNews, setHasMorePaginationNews] =
    useState<boolean>(true);
  const [selectOption, setSelectOption] = useState<string>(
    selectOptions[0].value
  );

  const handleFetchMoreData = (): void => {
    getNewsByTechnology(selectOption, pagination + 1)
      .then((res: any) => {
        if (res.hits.length > 0) {
          const postData: News[] = res.hits.map((hit: any) => ({
            objectID: hit.objectID,
            author: hit.author,
            created_at: hit.created_at,
            story_title: hit.story_title,
            story_url: hit.story_url,
            is_liked: handleIsLiked(hit.objectID),
          }));

          setNews([...news, ...postData]);
          setPagination((prev) => prev + 1);
          setHasMorePaginationNews(true);
        } else {
          setHasMorePaginationNews(false);
        }
      })
      .catch((error) => {
        setHasMorePaginationNews(false);
        throw new Error(error);
      });
  };

  const fetchMoreFavorites = () => {};

  const handleAddFavorite = (id: string) => {
    const newFavPost = news.filter(
      (newFavPost) => newFavPost.objectID === id.toString()
    )[0];

    const isDuplicated = favorites.some(
      (favorite) => favorite.objectID === newFavPost.objectID
    );

    if (!isDuplicated) {
      setFavorites([...favorites, { ...newFavPost, is_liked: true }]);
      setLikedPosts([...likedPosts, id]);
      setNews((current) =>
        current.map((obj) => {
          if (obj.objectID.toString() === id) {
            return { ...obj, is_liked: true };
          }

          return obj;
        })
      );
      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, newFavPost])
      );
      localStorage.setItem("liked-posts", JSON.stringify([...likedPosts, id]));
    }
  };

  const handleRemoveFavorite = (id: string) => {
    const newFavoritesArr = favorites.filter(
      (favorite) => favorite.objectID.toString() !== id.toString()
    );

    setNews((current) =>
      current.map((obj) => {
        if (obj.objectID.toString() === id) {
          return { ...obj, is_liked: false };
        }

        return obj;
      })
    );
    setFavorites(newFavoritesArr);
    localStorage.setItem("favorites", JSON.stringify(newFavoritesArr));
  };

  const handleActiveCategory = (category: string) => {
    setActiveCategory(category);
  };

  const handleFavoriteLocalStorage = () => {
    const favoritesLocalStorage: string | null =
      localStorage.getItem("favorites");
    if (favoritesLocalStorage) {
      const arrFavoritesLocalStorage: News[] = favoritesLocalStorage
        ? JSON.parse(favoritesLocalStorage)
        : "";

      setFavorites(arrFavoritesLocalStorage);
    }
  };

  const handleSelect = (selectValue: string) => {
    const initialPagination = 0;
    setHasMorePaginationNews(true);
    setPagination(0);
    setSelectOption(selectValue);

    getNewsByTechnology(selectValue, initialPagination)
      .then((res) => {
        const postData: News[] = res.hits.map((hit) => ({
          objectID: hit.objectID,
          author: hit.author,
          created_at: hit.created_at,
          story_title: hit.story_title,
          story_url: hit.story_url,
          is_liked: handleIsLiked(hit.objectID),
        }));

        setNews(postData);
      })
      .catch((error) => {
        throw new Error(error);
      });

    localStorage.setItem("select-value", selectValue);
  };

  const handleLikedPostsLocalStorage = () => {
    if (localStorage.getItem("liked-posts")) {
      const likedPostsLocalStorage: string | null =
        localStorage.getItem("liked-posts") || "";

      setLikedPosts(JSON.parse(likedPostsLocalStorage));
      return JSON.parse(likedPostsLocalStorage);
    }
  };

  const handleIsLiked = (objectID: string) => {
    if (localStorage.getItem("liked-posts")) {
      const likedPostsLocalStorage: string | null =
        localStorage.getItem("liked-posts") || "";

      return JSON.parse(likedPostsLocalStorage).includes(objectID);
    }
  };

  const handleSelectValue = (): any => {
    const localStorageSelectValue: string | null =
      localStorage.getItem("select-value");
    if (!localStorageSelectValue) return selectOptions[0];

    if (localStorageSelectValue) {
      let selectedOption = selectOptions.find(
        (option: SelectOption) => option.value === localStorageSelectValue
      );

      return selectedOption;
    }
  };

  useEffect(() => {
    handleFavoriteLocalStorage();
    handleLikedPostsLocalStorage();
    setSelectOption(handleSelectValue().value);
  }, []);

  useEffect(() => {
    getNewsByTechnology(handleSelectValue().value, 0)
      .then((res) => {
        const postData: News[] = res.hits.map((hit) => ({
          objectID: hit.objectID,
          author: hit.author,
          created_at: hit.created_at,
          story_title: hit.story_title,
          story_url: hit.story_url,
          is_liked: handleIsLiked(hit.objectID),
        }));

        setNews(postData);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [getNewsByTechnology]);

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
                options={selectOptions}
                defaultValue={handleSelectValue()}
                onChange={(evt) => handleSelect(evt.value)}
              />
            </div>
          )}

          {/* Card list */}
          {activeCategory === "all" && (
            <div>
              <InfiniteScroll
                dataLength={news.length}
                next={handleFetchMoreData}
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
                            newsInfo.is_liked
                              ? handleRemoveFavorite(newsInfo.objectID)
                              : handleAddFavorite(newsInfo.objectID)
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
                next={fetchMoreFavorites}
                hasMore={hasMorePaginationNews}
                loader={<div>Loading...</div>}
                className="news-card-list news-list"
              >
                {favorites.map(
                  (newsInfo, i) =>
                    newsInfo.story_url && (
                      <div className="news-item" key={i}>
                        {newsInfo.objectID}
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
        </div>
      </div>
    </div>
  );
};

export default Home;
