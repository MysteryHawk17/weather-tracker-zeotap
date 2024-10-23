function convertTemperature(
  using: string,
  temperatureInKelvin: number
): number {
  if (using.toLowerCase() === "celsius") {
    return temperatureInKelvin - 273.15;
  } else if (using.toLowerCase() === "fahrenheit") {
    return ((temperatureInKelvin - 273.15) * 9) / 5 + 32;
  } else {
    throw new Error('Invalid unit. Please use "celsius" or "fahrenheit".');
  }
}

export default convertTemperature;
