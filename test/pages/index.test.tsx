import React from "react";
import { render, fireEvent } from "../testUtils";
import About from "../../src/pages/about";

describe("About page", () => {
  // beforeAll(() => {
  //   jest.mock("react-i18next", () => ({
  //     useTranslation: () => ({ t: (key: any) => key }),
  //   }));
  // });
  // it("matches snapshot", () => {
  //   const { asFragment } = render(<About />, {});
  //   expect(asFragment()).toMatchSnapshot();
  // });
  // it("clicking button triggers alert", () => {
  //   const { getByText } = render(<About />, {});
  //   window.alert = jest.fn();
  //   fireEvent.click(getByText("Test Button"));
  //   expect(window.alert).toHaveBeenCalledWith("With typescript and Jest");
  // });
});
