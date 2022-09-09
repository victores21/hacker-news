import "./Home.css";
import IconAngular from "../../assets/images/icon_angular.png";
import IconReact from "../../assets/images/icon_react.png";
import IconVue from "../../assets/images/icon_vue.png";
import useComponents from "../../components";
import Select from "react-select";

const Home = () => {
  const { NewsCard, Header } = useComponents();
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

  return (
    <div>
      <Header />

      <div className="content">
        <div className="center">
          {/* Categories */}
          <div className="categories">
            <div className="category category--active">All</div>
            <div className="category">My Faves</div>
          </div>

          {/* Selector */}
          <div className="select-box">
            <Select options={options} defaultValue={options[0]} />
          </div>

          {/* Card list */}
          <div className="news-card-list news-list">
            <NewsCard isFavorite={true} />
            <NewsCard isFavorite={false} />
            <NewsCard isFavorite={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
