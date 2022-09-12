import { useEffect, useState } from "react";

//controllers
import useServices from "../../../api/services";

//Images
import IconAngular from "../../../assets/images/icon_angular.png";
import IconReact from "../../../assets/images/icon_react.png";
import IconVue from "../../../assets/images/icon_vue.png";

//Interfaces
import { News, SelectOption } from "../../../shared/interfaces/home.interfaces";

const useHome = () => {
  // Hooks
  const { getNewsByTechnology } = useServices();

  //CONSTS
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

  // States
  const [news, setNews] = useState<News[]>([]);
  const [favorites, setFavorites] = useState<News[]>([]);
  const [likedPosts, setLikedPosts] = useState<Array<string>>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pagination, setPagination] = useState<number>(0);
  const [hasMorePaginationNews, setHasMorePaginationNews] =
    useState<boolean>(true);
  const [selectedTechnology, setSelectedOption] = useState<string>(
    selectOptions[0].value
  );

  //Handlers
  const handleFetchMoreData = (): void => {
    getNewsByTechnology(selectedTechnology, pagination + 1)
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
    setSelectedOption(selectValue);

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

  const handleLikedPostsLocalStorage = (): Array<string> | undefined => {
    if (localStorage.getItem("liked-posts")) {
      const likedPostsLocalStorage: string | null =
        localStorage.getItem("liked-posts") || "";

      setLikedPosts(JSON.parse(likedPostsLocalStorage));
      return JSON.parse(likedPostsLocalStorage);
    }
  };

  const handleIsLiked = (objectID: string): boolean => {
    if (!localStorage.getItem("liked-posts")) return false;

    const likedPostsLocalStorage: string | null =
      localStorage.getItem("liked-posts") || "";

    return JSON.parse(likedPostsLocalStorage).includes(objectID);
  };

  const handleSelectValue = (): any => {
    const localStorageSelectValue: string | null =
      localStorage.getItem("select-value");
    if (!localStorageSelectValue) return selectOptions[0];

    let selectedTechnology = selectOptions.find(
      (option: SelectOption) => option.value === localStorageSelectValue
    );

    return selectedTechnology;
  };

  useEffect(() => {
    handleFavoriteLocalStorage();
    handleLikedPostsLocalStorage();
    setSelectedOption(handleSelectValue().value);
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [getNewsByTechnology]);

  return {
    selectOptions,
    news,
    favorites,
    activeCategory,
    hasMorePaginationNews,
    selectedTechnology,
    handleFetchMoreData,
    fetchMoreFavorites,
    handleAddFavorite,
    handleRemoveFavorite,
    handleActiveCategory,
    handleSelect,
    handleSelectValue,
  };
};
export default useHome;
