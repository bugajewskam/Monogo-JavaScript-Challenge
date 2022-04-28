const https = require("https");
https.get("https://www.monogo.pl/competition/input.txt", (res) => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", (data) => {
    body += data;
  });
  res.on("end", () => {
    const input = JSON.parse(body);
    // Musisz pogrupować produkty według ich opcji kolorów i rozmiarów za pomocą pola ID
    // (zwróć uwagę na typy danych!). Jeden produkt może mieć tylko jedną opcję rozmiaru i koloru
    // (nie ma duplikatów produktów i ich opcji).
    const pricesMap = input.products.reduce((acc, curr) => {
      acc[curr.id] = curr.price;
      return acc;
    }, {});
    const colorsMap = input.colors.reduce((acc, curr) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {});
    const sizesMap = input.sizes.reduce((acc, curr) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {});
    const ids = [
      ...new Set([
        ...Object.keys(pricesMap),
        ...Object.keys(colorsMap),
        ...Object.keys(sizesMap)
      ])
    ];
    const products = ids.map((id) => ({
      id: id,
      price: pricesMap[id],
      color: colorsMap[id],
      size: sizesMap[id]
    }));
    // Następnie należy odfiltrować zgrupowane produkty, aby dopasować je do wybranych filtrów i
    // uzyskać tylko te produkty, których cena jest wyższa niż 200 (x > 200).
    const { colors: colorFilters, sizes: sizeFilters } = input.selectedFilters;
    const filteredProducts = products.filter(
      (p) =>
        colorFilters.includes(p.color) &&
        sizeFilters.includes(p.size) &&
        p.price > 200
    );
    // Następnie należy uzyskać wartość poprzez pomnożenie najniższej i najwyższej ceny z przefiltrowanej
    // listy produktów. Wynik należy sformatować tak, aby był liczbą całkowitą (zaokrągloną,
    // bez części ułamkowej).
    filteredProducts.sort((x, y) => x.price - y.price);
    const result = Math.round(
      filteredProducts[0].price *
        filteredProducts[filteredProducts.length - 1].price
    ).toFixed(0);
    // Następnie musisz utworzyć tablicę z liczby, którą wcześniej otrzymałeś, dodając co drugą cyfrę tej liczby
    // do poprzedniej (np. 123456 -> [1 + 2, 3 + 4, 5 + 6] -> [3, 7, 11].
    const digits = result.split("").map((x) => parseInt(x));

    const sum = digits.reduce((acc, curr, index) => {
      if (index % 2 === 0) {
        acc.push(curr);
      } else {
        acc[acc.length - 1] += curr;
      }
      return acc;
    }, []);
    const index = sum.indexOf(14);
    // Wynik będzie rezultatem mnożenia indeksu numeru lubelskiego biurowca Monogo w tablicy z punktu 5, wartości,
    // którą otrzymałeś w punkcie 4, oraz długości nazwy firmy "Monogo".
    // Wynik powinien być prezentowany w konsoli za pomocą console.log().
    console.log(result * index * "Monogo".length);
  });
});
