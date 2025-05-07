import { describe, it, expect } from "vitest";
import { convertCssWidthPropertyValueToPixels } from "./convertCssWidthPropertyToPixels";

describe("convertCssWidthPropertyValueToPixels", () => {
  it("should convert 'px' value to pixels", () => {
    const element = document.createElement("div");
    element.style.width = "100px";

    const result = convertCssWidthPropertyValueToPixels({
      element,
      cssProperty: "width",
    });

    expect(result).toBe(100);
  });

  it("should convert '%' value to pixels based on parent width", () => {
    const parent = document.createElement("div");
    parent.style.width = "200px";
    document.body.appendChild(parent);

    const element = document.createElement("div");
    element.style.width = "50%";
    parent.appendChild(element);

    const result = convertCssWidthPropertyValueToPixels({
      element,
      cssProperty: "width",
    });

    expect(result).toBe(100);

    document.body.removeChild(parent);
  });

  it("should convert 'em' value to pixels based on font size", () => {
    const element = document.createElement("div");
    element.style.fontSize = "16px";
    element.style.width = "2em";

    const result = convertCssWidthPropertyValueToPixels({
      element,
      cssProperty: "width",
    });

    expect(result).toBe(32);
  });

  it("should convert 'rem' value to pixels based on root font size", () => {
    document.documentElement.style.fontSize = "16px";

    const element = document.createElement("div");
    element.style.width = "2rem";

    const result = convertCssWidthPropertyValueToPixels({
      element,
      cssProperty: "width",
    });

    expect(result).toBe(32);
  });

  it("should convert 'vw' value to pixels based on viewport width", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1000,
      writable: true,
    });

    const element = document.createElement("div");
    element.style.width = "10vw";

    const result = convertCssWidthPropertyValueToPixels({
      element,
      cssProperty: "width",
    });

    expect(result).toBe(100);
  });

  it("should convert 'vh' value to pixels based on viewport height", () => {
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    const element = document.createElement("div");
    element.style.width = "10vh";

    const result = convertCssWidthPropertyValueToPixels({
      element,
      cssProperty: "width",
    });

    expect(result).toBe(80);
  });

  it("should throw an error for invalid CSS property", () => {
    const element = document.createElement("div");

    expect(() =>
      convertCssWidthPropertyValueToPixels({
        element,
        cssProperty: "invalid-property",
      }),
    ).toThrowError(
      'CSS property "invalid-property" is not defined or invalid.',
    );
  });

  it("should throw an error for invalid CSS value", () => {
    const element = document.createElement("div");
    element.style.width = "fdsfsdgtsdgs";

    expect(() =>
      convertCssWidthPropertyValueToPixels({
        element,
        cssProperty: "width",
      }),
    ).toThrowError('CSS property "width" is not defined or invalid.');
  });

  it("should throw error for unsupported units", () => {
    const element = document.createElement("div");
    element.style.width = "10pxn";

    expect(() =>
      convertCssWidthPropertyValueToPixels({
        element,
        cssProperty: "width",
      }),
    ).toThrowError('CSS property "width" is not defined or invalid.');
  });

  it("Should throw an error for a missing unit", () => {
    const element = document.createElement("div");
    element.style.width = "10";
    expect(() =>
      convertCssWidthPropertyValueToPixels({
        element,
        cssProperty: "width",
      }),
    ).toThrowError('CSS property "width" is not defined or invalid.');
  });
  it("should handle missing parent element for '%' value", () => {
    const element = document.createElement("div");
    element.style.width = "50%";

    expect(() =>
      convertCssWidthPropertyValueToPixels({
        element,
        cssProperty: "width",
      }),
    ).toThrowError(
      "The element uses a percent unit, but is unattached to a parent to calculate a percent from.",
    );
  });
});
