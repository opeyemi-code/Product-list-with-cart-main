// ================== GLOBAL VARIABLES ==================
const productList = document.querySelector(".product__list");
const cart = document.querySelector(".cart");
const dialog = document.querySelector("dialog");

const orderConfirmationList = document.querySelector(
  ".order-confirmation__list"
);
const orderConfirmedBtn = document.querySelector(".order-confirmation__button");

const url = "./data.json";

// Load saved cart items from localStorage
const storedItems = localStorage.getItem("cartItems");
let selectedItems = Array.isArray(JSON.parse(storedItems))
  ? JSON.parse(storedItems)
  : [];

// ================== FETCH PRODUCTS ==================
async function getData(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

// Render product items from JSON data
getData(url).then((data) => {
  data.map((item, index) => {
    // Create product item wrapper
    const productItem = document.createElement("div");
    productItem.className = "product__item";
    productItem.id = index;
    productItem.innerHTML = `
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
    `;
    productList.appendChild(productItem);

    // Add-to-cart button
    const productAddToCartBtn = document.createElement("button");
    productAddToCartBtn.classList = "product__btn product__add-to-cart";
    productAddToCartBtn.innerHTML = `
      <span class="cart-icon-wrapper">
        <img class="cart-icon" src="./assets/images/icon-add-to-cart.svg" alt="Cart">
      </span>
      Add to Cart`;
    productItem.appendChild(productAddToCartBtn);

    // Quantity counter UI
    const productCounter = document.createElement("span");
    productCounter.classList = "product__counter product__btn";

    const decrementBtn = document.createElement("button");
    decrementBtn.classList = "decrement-btn counter-btn counter-btn--hover";
    decrementBtn.innerHTML = `-`;
    productCounter.appendChild(decrementBtn);

    const countElement = document.createElement("span");
    countElement.classList.add("count");
    countElement.innerHTML = `1`;
    productCounter.appendChild(countElement);

    const incrementBtn = document.createElement("button");
    incrementBtn.classList = "increment-btn counter-btn counter-btn--hover";
    incrementBtn.innerHTML = `+`;
    productCounter.appendChild(incrementBtn);

    productItem.appendChild(productCounter);

    // Attach event listeners
    productAddToCartBtn.addEventListener("click", addToCart);
    incrementBtn.addEventListener("click", increaseItemQuantity);
    decrementBtn.addEventListener("click", decreaseItemQuantity);

    // Add-to-cart handler
    function addToCart(e) {
      const productItemElement = e.currentTarget.parentElement;
      selectedItems.push({
        id: productItemElement.id,
        thumbnail: data[productItemElement.id].image.thumbnail,
        name: data[productItemElement.id].name,
        price: data[productItemElement.id].price,
        quantity: 1,
      });

      localStorage.setItem("cartItems", JSON.stringify(selectedItems));

      productItemElement.classList.add("selected");
      productAddToCartBtn.style.display = "none";
      productCounter.style.display = "flex";
      productItemElement.firstElementChild.lastElementChild.style.border =
        "red 2px solid";

      // Update cart section
      updateCartDisplay();
    }

    // Restore state if already selected
    displayQantityCounter(productItem);
  });
});

// ================== CART RENDERING ==================
function emptyCart() {
  const cartEmptyState = document.createElement("div");
  cartEmptyState.classList.add("cart__empty-state");
  cartEmptyState.innerHTML = `
    <h2 class="cart__title">Your Cart (<span>0</span>)</h2>
    <div class="cart__image-wrapper">
      <img class="illustration-empty-cart" src="./assets/images/illustration-empty-cart.svg" alt="" />
      <p class="cart__description">Your added items will appear here</p>
    </div>`;
  cart.appendChild(cartEmptyState);
}

function cartItem(cartList) {
  selectedItems.map((selectedItem) => {
    const cartItem = document.createElement("li");
    cartItem.id = selectedItem.name;
    cartItem.classList.add("cart__item");
    cartItem.innerHTML = `
      <h4 class="cart__item-name">${selectedItem.name}</h4>
      <div class="cart__item-data">
        <p class="cart__item-quantity"><span class="quantity">${
          selectedItem.quantity
        }</span>x</p>
        <p class="cart__item-price">@$<span class="price">${Number(
          selectedItem.price
        ).toFixed(2)}</span></p>
        <p class="cart__item-total-price">\$${(
          selectedItem.price * selectedItem.quantity
        ).toFixed(2)}</p>
        <button class="remove-item-btn">
          X
        </button>
      </div>
    `;
    cartList.appendChild(cartItem);

    // Remove item handler
    cartItem.addEventListener("click", removeCartItem);
    function removeCartItem(e) {
      console.log(e.target.classList.contains("remove-item-btn"));
      if (e.target.classList.contains("remove-item-btn")) {
        const matchedItem = selectedItems.find(
          (item) => e.currentTarget.id === item.name
        );
        if (matchedItem) {
          selectedItems.splice(selectedItems.indexOf(matchedItem), 1);
          localStorage.setItem("cartItems", JSON.stringify(selectedItems));

          // Reset product display
          const productItem = document.getElementById(matchedItem.id);
          if (productItem) {
            const addToCartBtn = productItem.querySelector(
              ".product__add-to-cart"
            );
            const productCounter =
              productItem.querySelector(".product__counter");
            const productImage = productItem.querySelector("picture img");

            if (addToCartBtn) addToCartBtn.style.display = "flex";
            if (productCounter) productCounter.style.display = "none";
            if (productImage) productImage.style.border = "";
          }
        }
        updateCartDisplay();
      }
    }
  });
}

function filledCart() {
  cart.innerHTML = ""; // reset cart section

  const cartWithItems = document.createElement("div");
  cartWithItems.classList.add("cart__with-items");

  const cartTitle = document.createElement("h2");
  cartTitle.classList.add("cart__title");
  cartTitle.innerHTML = `Your Cart (<span class="coun">${selectedItems.length}</span>)`;

  const cartList = document.createElement("ul");
  cartList.classList.add("cart__list");

  const cartOrderSection = document.createElement("div");
  cartOrderSection.classList.add("cart__order-data");
  cartOrderSection.innerHTML = `
    <div class="cart__order">
      <p class="cart__order-text">Order Total</p>
      <p class="cart__order-total">\$${selectedItems
        .reduce(
          (total, selectedItem) =>
            total + selectedItem.price * selectedItem.quantity,
          0
        )
        .toFixed(2)}</p>
    </div>
    <div class="cart__note">
      <p class="cart__note-description">
        <img src="./assets/images/icon-carbon-neutral.svg" alt="" />
        This is a <strong>carbon-netural</strong> delivery
      </p>
    </div>
    <button class="cart__confirm-order-btn">Confirm Order</button>
  `;

  cartItem(cartList);
  cartWithItems.appendChild(cartTitle);
  cartWithItems.appendChild(cartList);
  cart.appendChild(cartWithItems);
  cart.appendChild(cartOrderSection);

  const confirmOrderBtn = document.querySelector(".cart__confirm-order-btn");
  confirmOrderBtn.addEventListener("click", orderConfirmed);
}

function updateCartDisplay() {
  cart.innerHTML = "";
  if (selectedItems.length === 0) {
    emptyCart();
  } else {
    filledCart();
  }
}

// ================== QUANTITY HANDLERS ==================
function displayUpdatedQuantity(e, parentId) {
  const updatedItem = selectedItems.find(
    (item) => parentId === Number(item.id)
  );
  if (e.currentTarget.classList.contains("increment-btn") && updatedItem) {
    e.currentTarget.previousElementSibling.innerHTML = updatedItem.quantity;
  } else {
    e.currentTarget.nextElementSibling.innerHTML = updatedItem.quantity;
  }
}

function increaseItemQuantity(e) {
  e.preventDefault();
  let parentId = Number(e.currentTarget.parentElement.parentElement.id);

  selectedItems = selectedItems.map((item) => {
    if (Number(item.id) === parentId) {
      return { ...item, quantity: item.quantity + 1 };
    }
    return item;
  });

  displayUpdatedQuantity(e, parentId);
  localStorage.setItem("cartItems", JSON.stringify(selectedItems));
  updateCartDisplay();
}

function decreaseItemQuantity(e) {
  e.preventDefault();
  let parentId = Number(e.currentTarget.parentElement.parentElement.id);

  selectedItems = selectedItems.map((item) => {
    if (Number(item.id) === parentId) {
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  });

  displayUpdatedQuantity(e, parentId);

  const filterdItem = selectedItems.find(
    (item) => Number(item.id) === parentId
  );

  if (filterdItem.quantity < 1) {
    selectedItems.splice(selectedItems.indexOf(filterdItem));
    e.currentTarget.nextElementSibling.innerHTML = 1;
    e.currentTarget.parentElement.style.display = "none";
    e.currentTarget.parentElement.previousElementSibling.style.display = "flex";
    e.currentTarget.parentElement.parentElement.firstElementChild.lastElementChild.removeAttribute(
      "style"
    );
  }

  localStorage.setItem("cartItems", JSON.stringify(selectedItems));
  updateCartDisplay();
}

function displayQantityCounter(productItem) {
  const matchedItem = selectedItems.find(
    (cartItem) => Number(cartItem.id) === Number(productItem.id)
  );

  if (matchedItem) {
    const addToCartBtn = productItem.querySelector(".product__add-to-cart");
    if (addToCartBtn) addToCartBtn.style.display = "none";

    const productCounter = productItem.querySelector(".product__counter");
    if (productCounter) {
      productCounter.style.display = "flex";
      const countElement = productCounter.querySelector(".count");
      if (countElement) countElement.innerHTML = matchedItem.quantity;
    }

    const productImage = productItem.querySelector("picture img");
    if (productImage) productImage.style.border = "red 2px solid";
  }
}

// ================== ORDER CONFIRMATION ==================
function orderConfirmed(e) {
  e.preventDefault();

  selectedItems.map((selectedItem) => {
    const listItem = document.createElement("li");
    listItem.classList.add("order-confirmation__item");
    listItem.innerHTML = `
      <img src="${selectedItem.thumbnail}" alt="${
      selectedItem.name
    }" class="order-confirmation__item-image"/>
      <div class="order-confirmation__item-details">
        <h4 class="order-confirmation__item-name">${selectedItem.name}</h4>
        <div class="order-confirmation__item-meta">
          <span class="order-confirmation__item-qty">${
            selectedItem.quantity
          }X</span>
          <span class="order-confirmation__item-price">@ $${selectedItem.price.toFixed(
            2
          )}</span>
        </div>
      </div>
      <p class="order-confirmation__item-total">\$${(
        selectedItem.price * selectedItem.quantity
      ).toFixed(2)}</p>`;
    orderConfirmationList.appendChild(listItem);

    dialog.showModal();
  });

  // For small screens, hide cart and products
  if (screen.width <= 468) {
    dialog.showModal();
    cart.style.display = "none";
    productList.style.display = "none";
  }

  // Update order total in confirmation
  orderConfirmationList.nextElementSibling.lastElementChild.innerHTML = `$${selectedItems
    .reduce(
      (total, selectedItem) =>
        total + selectedItem.price * selectedItem.quantity,
      0
    )
    .toFixed(2)}`;
}

function startNewOrder(e) {
  e.preventDefault();

  selectedItems.forEach((selectedItem) => {
    const selectedProductItem = document.getElementById(selectedItem.id);
    selectedProductItem.firstElementChild.lastElementChild.style.border =
      "none";
    selectedProductItem.lastElementChild.previousElementSibling.style.display =
      "block";
    selectedProductItem.lastElementChild.style.display = "none";
  });

  // Reset data
  selectedItems = [];
  localStorage.setItem("cartItems", JSON.stringify(selectedItems));

  // Reset UI
  orderConfirmationList.innerHTML = "";
  cart.style.display = "block";
  productList.style.display = "grid";
  localStorage.setItem("cartItems", JSON.stringify(selectedItems));
  updateCartDisplay();

  // Close Dialog
  dialog.close();
}

// ================== EVENT LISTENERS ==================
orderConfirmedBtn.addEventListener("click", startNewOrder);

// ================== INITIALIZE CART ==================
updateCartDisplay();
