//Styles
import "./Home.css";

//Controllers
import useComponents from "../../components";
import useControllers from "../../controllers";

//External Libs
import Select from "react-select";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  //Components
  const { NewsCard, Header } = useComponents();

  //Controllers
  const { useScreenHooks } = useControllers();

  // Screen Hook
  const { useHome } = useScreenHooks();
  const {
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
  } = useHome();

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
          {selectedTechnology && (
            <div className="select-box">
              <Select
                options={selectOptions}
                defaultValue={handleSelectValue()}
                onChange={(evt) => handleSelect(evt.value)}
              />
            </div>
          )}

          {/* Post list */}

          {/* When activeCategory is 'All' show this list */}
          {activeCategory === "all" && (
            <div className="list-all">
              <InfiniteScroll
                dataLength={news.length}
                next={handleFetchMoreData}
                hasMore={hasMorePaginationNews}
                loader={<div>Loading...</div>}
                className="news-card-list news-list "
              >
                {news.map(
                  (newsInfo, i) =>
                    newsInfo.story_url && (
                      <div className="news-item" key={i}>
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

          {/* When activeCategory is 'favorites' show this list for favorites */}
          {activeCategory === "favorites" && (
            <div className="list-favorites">
              <InfiniteScroll
                dataLength={favorites.length}
                next={fetchMoreFavorites}
                hasMore={hasMorePaginationNews}
                loader={<div>Loading...</div>}
                className="news-card-list news-list "
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
        </div>
      </div>
    </div>
  );
};

export default Home;
