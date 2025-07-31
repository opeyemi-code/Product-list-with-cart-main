const productList = document.querySelector(".product__list");
const url = "./data.json";

const img = "./";

async function getData(url) {
  const response = await fetch(url);
  const result = await response.json();

  return result;
}

getData(url).then((data) => {
  data.map((item, index) => {
    const div = document.createElement("div");
    div.className = "product__item";
    div.id = index;
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
    <button type="button" class="product__btn product__add-to-cart">
      <span class="cart-icon-wrapper">
      <img class="cart-icon" src="./assets/images/icon-add-to-cart.svg" alt="Cart">
      </span>
      Add to Cart
    </button>
    <span class="product__counter product__btn">
    <button class="decrement-btn counter-btn" type="button">-</button>
    <span class="count">0</span>
    <button class="increment-btn counter-btn" type="button">+</button>
    </span>
  `;
    productList.appendChild(div);
  });
});

export default getData;
