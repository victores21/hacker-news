import { fireEvent, render } from "@testing-library/react";
import HeartIcon from "./HeartIcon";

describe("HeartIcon component", () => {
  const mockedHeartIconStates = {
    liked:
      "M12 3.248C8.852-2.154 0-.577 0 6.192 0 10.853 5.571 15.619 12 22c6.43-6.381 12-11.147 12-15.808C24-.6 15.125-2.114 12 3.248z",
    noLiked:
      "M12 8.229C12.234 7.109 13.547 2 17.382 2 19.602 2 22 3.551 22 7.003c0 3.907-3.627 8.47-10 12.629C5.627 15.473 2 10.91 2 7.003c0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zM0 7.003C0 11.071 3.06 16.484 12 22c8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737C9.662-1.996 0-1.004 0 7.003z",
  };

  it("should render HeartIcon Liked if isFavorite is true", () => {
    const { container } = render(<HeartIcon isFavorite={true} />);
    const svgPath = container.querySelector("path");

    expect(svgPath).toHaveAttribute("d", mockedHeartIconStates.liked);
  });

  it("should render HeartIcon no liked if isFavorite is false", () => {
    const { container } = render(<HeartIcon isFavorite={false} />);
    const svgPath = container.querySelector("path");

    expect(svgPath).toHaveAttribute("d", mockedHeartIconStates.noLiked);
  });
});
