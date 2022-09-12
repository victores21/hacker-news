import { render } from "@testing-library/react";
import NewsCard from "./NewsCard";

describe("NewsCard component", () => {
  const newsCardMock = {
    isFavorite: false,
    author: "John",
    date: "2022-09-12T01:17:30.000Z",
    title: "Test",
    newsUrl:
      "https://academic.oup.com/restud/article-abstract/81/2/535/1517632",
    onClickFavorite: () => {},
  };
  const component = render(
    <NewsCard
      isFavorite={newsCardMock.isFavorite}
      author={newsCardMock.author}
      date={newsCardMock.date}
      title={newsCardMock.title}
      newsUrl={newsCardMock.newsUrl}
      onClickFavorite={newsCardMock.onClickFavorite}
    />
  );

  it("Card renders props as expected", () => {
    const { getByText, getByRole } = component;

    const txtAuthor = getByText(newsCardMock.author).textContent;
    const txtTitle = getByText(newsCardMock.title).textContent;

    expect(txtAuthor).toBe(newsCardMock.author);
    expect(txtTitle).toBe(newsCardMock.title);
    expect(getByRole("link")).toHaveAttribute("href", newsCardMock.newsUrl);
  });
});
