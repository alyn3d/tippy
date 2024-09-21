const fetchCurrencyData = async (currency:any) => {
  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${currency}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${currency}`);
    }
    const data = await response.json();
    return { [currency]: data.rates };
  } catch (error) {
    console.error(`Error fetching data for ${currency}:`, error);
    return null;
  }
};

export const fetchAllCurrenciesData = async (currencies:any) => {
  const currenciesData = {};
  const fetchPromises = currencies.map(async (currency:any) => {
    const currencyData = await fetchCurrencyData(currency);
    if (currencyData) {
      Object.assign(currenciesData, currencyData);
    }
  });

  await Promise.all(fetchPromises);
  return currenciesData;
};
