import React from "react";
import { render, screen, fireEvent } from "@/tests/testUtils";
import SvgIcon from "@/components/ui/SvgIcon";

describe("SvgIcon component", () => {
  it.skip("should return element with empty content", () => {
    render(<SvgIcon icon="homeError" />, {});
    const element = screen.getByTestId("homeError");
    expect(element.textContent).toMatch("");
  });
  it.skip("should return svg element", () => {
    render(<SvgIcon icon="home" />, {});
    const element = screen.getByTestId("home");
    expect(element).toBeDefined();
  });
  it.skip("should return svg element with fontSize LARGE", () => {
    render(<SvgIcon icon="home" fontSize="large" />, {});
    const element = screen.getByTestId("home");
    expect(element).toHaveClass("MuiSvgIcon-fontSizeLarge");
  });
  it.skip("should return svg element with color #000", () => {
    render(<SvgIcon icon="home" htmlColor="#000" />, {});
    const element = screen.getByTestId("home");
    expect(element).toHaveAttribute("color");
  });
});
