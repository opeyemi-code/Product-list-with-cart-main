const productList = document.querySelector(".product__list");
const url = "./data.json";

const img = "./";

async function getData(url) {
  const response = await fetch(url);
  const result = await response.json();

  return result;
}

getData(url).then((data) => {
  console.log(data[0].image.mobile);
  data.map((item) => {
    const div = document.createElement("div");
    div.className = "product__item";
    div.innerHTML = `
    <picture class="">
      <source media="(min-width: 1024px)" srcset="${item.image.desktop}">
      <source media="(min-width: 469px)" srcset="${item.image.tablet}">
      <source media="(max-width: 468px)" srcset="${item.image.mobile}">
      <img class="product__image" src="${
        item.image.mobile
      }" alt="Product image">
    </picture>
    <h3 class="product__category">${item.category}</h3>
    <h2 class="product__name">${item.name}</h2>
    <p class="product__price">\$${Number(item.price).toFixed(2)}</p>
    <button type="button" class="product__add-to-cart">
      <span class="cart-icon-wrapper">
      <img class="cart-icon" src="./assets/images/icon-add-to-cart.svg" alt="Cart">
      </span>
      Add to Cart
    </button>
  `;
    productList.appendChild(div);
  });
});
