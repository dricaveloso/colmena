import React from "react";
import { render, screen, fireEvent } from "@/tests/testUtils";
import About from "@/pages/about";

jest.mock("next-i18next");
describe("About page", () => {
  it.skip("should render correctly", () => {
    render(<About />, {});
    const element = screen.getByRole("heading");
    expect(element).toBeDefined();
  });
  // beforeAll(() => {
  //   jest.mock("react-i18next", (): any => ({
  //     useTranslation: (): any => ({
  //       t: (key: string): string => key.toUpperCase(),
  //     }),
  //   }));
  // });
  // it("matches snapshot", () => {
  //   const { asFragment } = render(<About />, {});
  //   expect(asFragment()).toMatchSnapshot();
  // });
  // it.skip("clicking button triggers alert", () => {
  //   const { getByText } = render(<About />, {});
  //   window.alert = jest.fn();
  //   fireEvent.click(getByText("Test Button"));
  //   expect(window.alert).toHaveBeenCalledWith("With typescript and Jest");
  // });
});
