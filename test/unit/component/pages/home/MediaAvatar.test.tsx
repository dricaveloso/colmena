import React from "react";
import { render, screen } from "@/tests/testUtils";
import MediaAvatar from "@/components/pages/home/MediaAvatar";

describe("MediaAvatar component", () => {
  it("should return avatar element", () => {
    render(<MediaAvatar size={17} />, {});
    const element = screen.getByAltText("avatar");
    expect(element).toBeInTheDocument();
  });
});
