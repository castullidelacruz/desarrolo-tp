export const transformCurrencySymbol = (currency) => {
  switch (currency) {
    case "PESO_ARG":
      return "$";
    case "REAL":
      return "R$";
    case "DOLAR_USA":
      return "US$";
    default:
      return currency;
  }
};
