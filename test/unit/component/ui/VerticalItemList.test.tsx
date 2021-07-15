import React from "react";
import { render, screen } from "@/tests/testUtils";
import VerticalItemList from "@/components/ui/VerticalItemList";

describe("VerticalItemList component", () => {
  it("should return a li element with img, text and 2 buttons", () => {
    render(
      <VerticalItemList id={1} title="Title" subtitle="Subtitle" img="/images/teste.jpg" />,
      {},
    );
    const imgElement = screen.getByRole("img");
    const titleElement = screen.getByTestId("title");
    const buttonElement = screen.getAllByRole("button");

    expect(imgElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(buttonElement.length).toEqual(2);
  });
  it("should return a li element with text and 2 buttons", () => {
    render(<VerticalItemList id={1} title="Title" subtitle="Subtitle" />, {});
    const titleElement = screen.getByTestId("title");
    const buttonElement = screen.getAllByRole("button");
    const imgElement = screen.queryByTestId("img-Title-1");

    expect(imgElement).not.toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(buttonElement.length).toEqual(2);
  });
});
