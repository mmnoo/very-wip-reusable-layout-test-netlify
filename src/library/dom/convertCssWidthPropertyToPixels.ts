const getCssWidthUnitStartIndex = (cssValue: string) =>
  cssValue
    .split("")
    .findIndex((char) => isNaN(parseFloat(char)) && char !== ".");

const isValidCssValue = (cssValue: string) => {
  const unitStartIndex = getCssWidthUnitStartIndex(cssValue); // Find the first non-numeric character
  if (unitStartIndex === -1) return false; // No unit found
  const numberPart = cssValue.slice(0, unitStartIndex).trim();
  const unitPart = cssValue.slice(unitStartIndex).trim();
  return !isNaN(parseFloat(numberPart)) && unitPart.length > 0;
};

export const convertCssWidthPropertyValueToPixels = ({
  element,
  cssProperty,
}: {
  element: HTMLElement;
  cssProperty: string;
}) => {
  if (!element || !cssProperty) {
    throw new Error("Invalid element or CSS property provided.");
  }

  const computedStyle = getComputedStyle(element);
  const cssValue = computedStyle.getPropertyValue(cssProperty).trim();

  if (!cssValue) {
    throw new Error(`CSS property "${cssProperty}" is not defined or invalid.`);
  }

  if (!isValidCssValue(cssValue)) {
    throw new Error(`Invalid CSS value: ${cssValue}`);
  }

  if (cssValue.endsWith("px")) {
    return parseFloat(cssValue);
  }

  const unitStartIndex = getCssWidthUnitStartIndex(cssValue);
  const doesCssValueContainUnit = unitStartIndex !== -1;

  const unit = doesCssValueContainUnit ? cssValue.slice(unitStartIndex) : "";
  const number = parseFloat(cssValue);

  switch (unit) {
    case "%": {
      const parent = element.parentElement;
      if (!parent) {
        throw new Error(
          "The element uses a percent unit, but is unattached to a parent to calculate a percent from.",
        );
      }
      const parentComputedStyle = getComputedStyle(parent);
      const parentWidth = parseFloat(parentComputedStyle.width);
      return (parentWidth * number) / 100;
    }
    case "em": {
      const fontSize = parseFloat(computedStyle.fontSize);
      return number * fontSize;
    }
    case "rem": {
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      return number * rootFontSize;
    }
    case "vw": {
      return (window.innerWidth * number) / 100;
    }
    case "vh": {
      return (window.innerHeight * number) / 100;
    }
    default:
      // this gets caught above but its here for clarity
      throw new Error(
        `CSS property "${cssProperty}" is not defined or invalid.`,
      );
  }
};
