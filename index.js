const productList = document.querySelector(".product__list");
const cart = document.querySelector(".cart");
const url = "./data.json";

const storedItems = localStorage.getItem("cartItems");
// let selectedItems = storedItems ? JSON.parse(storedItems) : [];

let selectedItems = Array.isArray(JSON.parse(storedItems))
  ? JSON.parse(storedItems)
  : [];

async function getData(url) {
  const response = await fetch(url);
  const result = await response.json();

  return result;
}

getData(url).then((data) => {
  data.map((item, index) => {
    // create div element for productItem
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

    // create a button element for the add-to-cart btn
    const productAddToCartBtn = document.createElement("button");
    productAddToCartBtn.classList = "product__btn product__add-to-cart";
    productAddToCartBtn.innerHTML = `<span class="cart-icon-wrapper">
      <img class="cart-icon" src="./assets/images/icon-add-to-cart.svg" alt="Cart">
      </span>
      Add to Cart`;
    productItem.appendChild(productAddToCartBtn);

    //create element for product quantity counter
    const productCounter = document.createElement("span");
    productCounter.classList = "product__counter product__btn";

    const decrementBtn = document.createElement("button");
    decrementBtn.classList = "decrement-btn counter-btn";
    decrementBtn.innerHTML = `-`;
    productCounter.appendChild(decrementBtn);

    const countElement = document.createElement("span");
    countElement.classList.add("count");
    countElement.innerHTML = `1`;
    productCounter.appendChild(countElement);

    const incrementBtn = document.createElement("button");
    incrementBtn.classList = "increment-btn counter-btn";
    incrementBtn.innerHTML = `+`;
    productCounter.appendChild(incrementBtn);
    productItem.appendChild(productCounter);

    productAddToCartBtn.addEventListener("click", addToCart);
    incrementBtn.addEventListener("click", increaseItemQuantity);
    decrementBtn.addEventListener("click", decreaseItemQuantity);

    //addToCart function
    function addToCart(e) {
      //hide add-to-cart btn when clicked
      //display product-counter
      //add selected item to cart with an initial quantity of one
      const productItemElement = e.currentTarget.parentElement;
      selectedItems.push({
        id: productItemElement.id,
        thumbnail: data[productItemElement.id].image.thumbnail,
        name: data[productItemElement.id].name,
        price: data[productItemElement.id].price,
        quantity: 1,
      });
      localStorage.setItem("cartItems", JSON.stringify(selectedItems));

      productAddToCartBtn.style.display = "none";
      productCounter.style.display = "flex";
      productItemElement.firstElementChild.lastElementChild.style.border =
        "red 2px solid";
      // Reload the cart section once a new item/update
      filledCart();
    }
    displayQantityCounter(productItem);
  });
});

function displayUpdatedQuantity(e, parentId) {
  const updatedItem = selectedItems.find(
    (item) => parentId === Number(item.id)
  );

  if (e.currentTarget.classList.contains("increment-btn") && updatedItem) {
    e.currentTarget.previousElementSibling.innerHTML = updatedItem.quantity;
    console.log(updatedItem.id);
  } else {
    e.currentTarget.nextElementSibling.innerHTML = updatedItem.quantity;
  }
}

// increaseItemQuantity

function increaseItemQuantity(e) {
  e.preventDefault();

  let itemQuantity;

  let parentId = Number(e.currentTarget.parentElement.parentElement.id);

  function currentQuantity() {
    selectedItems.array.forEach((element) => {
      if (element.id === parentId) {
        console.log(id);
      }
    });
  }

  // Correctly update the array using map
  selectedItems = selectedItems.map((item) => {
    if (Number(item.id) === parentId) {
      return {
        ...item,
        quantity: item.quantity + 1,
      };
    }
    itemQuantity = item.quantity;
    return item;
  });

  // e.currentTarget.previousElementSibling.innerHTML = `${selectedItems[parentId].quantity}`;
  displayUpdatedQuantity(e, parentId);

  localStorage.setItem("cartItems", JSON.stringify(selectedItems));
  filledCart();
}

function decreaseItemQuantity(e) {
  e.preventDefault();

  let itemQuantity;

  // 1. Decrease item quantity when clicked
  let parentId = Number(e.currentTarget.parentElement.parentElement.id);

  // Correctly update the array using map
  selectedItems = selectedItems.map((item) => {
    if (Number(item.id) === parentId) {
      return {
        ...item,
        quantity: item.quantity - 1,
      };
    }

    // itemQuantity = item.quantity;

    return item;
  });

  //
  displayUpdatedQuantity(e, parentId);

  // e.currentTarget.nextElementSibling.innerHTML = itemQuantity;
  // 2. Remove item from cart when it's less than 1

  const filterdItem = selectedItems.find(
    (item) => Number(item.id) === parentId
  );

  if (filterdItem.quantity < 1) {
    selectedItems.splice(selectedItems.indexOf(filterdItem));
    e.currentTarget.nextElementSibling.innerHTML = 1;
    console.log(e.currentTarget.nextElementSibling);
    e.currentTarget.parentElement.style.display = "none";
    e.currentTarget.parentElement.previousElementSibling.style.display = "flex";
    e.currentTarget.parentElement.parentElement.firstElementChild.lastElementChild.removeAttribute(
      "style"
    );
  }

  localStorage.setItem("cartItems", JSON.stringify(selectedItems));
  filledCart();
}

function emptyCart() {
  const cartEmptyState = document.createElement("div");
  cartEmptyState.classList.add("cart__empty-state");
  cartEmptyState.innerHTML = `
    <h2 class="cart__title">
      Your Cart (<span>0</span>)
    </h2>
    <div class="cart__image-wrapper">
      <img
        class="illustration-empty-cart"
        src="./assets/images/illustration-empty-cart.svg"
        alt=""
      />
      <p class="cart__description">Your added items will appear here</p>
    </div>
  `;
  cart.appendChild(cartEmptyState);
}

function cartItem(cartList) {
  selectedItems.map((selectedItem) => {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart__item");
    cartItem.innerHTML = `
                <h4 class="cart__item-name">${selectedItem.name}</h4>
                <div class="cart__item-data">
                  <p class="cart__item-quantity">
                    <span class="quantity">${selectedItem.quantity}</span>x
                  </p>
                  <p class="cart__item-price">
                    @$<span class="price">${Number(selectedItem.price).toFixed(
                      2
                    )}</span>
                  </p>
                  <p class="cart__item-total-price">\$${eval(
                    selectedItem.price * selectedItem.quantity
                  ).toFixed(2)}</p>
                  <button class="remove-item-btn" onclick=${"removeCartItem"}>
                    <img
                      class="icon-remove-item"
                      src="./assets/images/icon-remove-item.svg"
                      alt=""
                    />
                  </button>
                </div>
    `;
    cartList.appendChild(cartItem);

    function removeCartItem(e) {
      console.log("hello");
    }
  });
}

function filledCart() {
  //Reset the cart section
  // each time an item is added/updated
  cart.innerHTML = "";

  const cartWithItems = document.createElement("div");
  cartWithItems.classList.add("cart__with-items");

  const cartTitle = document.createElement("h2");
  cartTitle.classList.add("cart__title");
  cartTitle.innerHTML = `
  Your Cart (<span class="coun">${selectedItems.length}</span>)`;

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
        </div>
  `;

  cartItem(cartList);
  cartWithItems.appendChild(cartTitle);
  cartWithItems.appendChild(cartList);
  cart.appendChild(cartWithItems);
  cart.appendChild(cartOrderSection);
}

selectedItems.length > 0 ? filledCart() : emptyCart();

function displayQantityCounter(productItem) {
  // Check if this product is in selectedItems
  const matchedItem = selectedItems.find(
    (cartItem) => Number(cartItem.id) === Number(productItem.id)
  );

  if (matchedItem) {
    // Hide the add-to-cart button
    const addToCartBtn = productItem.querySelector(".product__add-to-cart");
    if (addToCartBtn) addToCartBtn.style.display = "none";

    // Show the counter
    const productCounter = productItem.querySelector(".product__counter");
    if (productCounter) {
      productCounter.style.display = "flex";
      const countElement = productCounter.querySelector(".count");
      if (countElement) countElement.innerHTML = matchedItem.quantity;
    }

    // Add the border to the image
    const productImage = productItem.querySelector("picture img");
    if (productImage) {
      productImage.style.border = "red 2px solid";
    }
  }
}
