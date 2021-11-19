import React from "react";
import { render, screen } from "@/tests/testUtils";
import GreetingMessage from "@/components/pages/home/GreetingMessage";

describe("GreetingMessage component", () => {
  it.skip("should return text element", () => {
    render(<GreetingMessage />, {});
    const element = screen.getByTestId("greetingMessage");
    expect(element).toBeInTheDocument();
  });
});
