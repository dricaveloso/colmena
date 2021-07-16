import React from "react";
import { render, screen } from "@/tests/testUtils";
import ActionsToListItems from "@/components/ui/ActionsToListItems";

describe("ActionsToListItem component", () => {
  it("should return a div with two icon buttons", () => {
    render(<ActionsToListItems />, {});
    const icon1 = screen.getByTestId("search");
    const icon2 = screen.getByTestId("equalize");
    expect(icon1).toBeInTheDocument();
    expect(icon2).toBeInTheDocument();
  });
});
