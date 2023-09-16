/* app.js */
// select elements
const productsEl = document.querySelector(".products");
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");
const totalEl = document.querySelector(".total-items-in-cart");

// render products
function renderProducts() {
  products.forEach((product) => {
    productsEl.innerHTML += `
      <div class="item">
          <div class="item-container">
            <div class="item-img">
              <img src="${product.imgSrc}" alt="${product.name}" />
            </div>
            <div class="desc">
              <h2>${product.name}</h2>
              <h2><small>$</small>${product.price}</h2>
              <p>
                ${product.description}
              </p>
            </div>
            <div class="add-to-wishlist">
              <img src="./icons/heart.png" alt="add to wish list" />
            </div>
            <div class="add-to-cart" onClick="addToCart(${product.id})">
              <img src="./icons/bag-plus.png" alt="add to cart" />
            </div>
          </div>
        </div>
    `;
  });
}

renderProducts();

// cart array
let cart = JSON.parse(localStorage.getItem("CART")) || [];
// let cart = localStorage.getItem("CART");
updateCart(); // 이건 왜 하지?

// Add to cart
function addToCart(id) {
  // check if product already exist in cart
  if (cart.some((item) => item.id === id)) {
    changeNumberOfUnits("plus", id);
  } else {
    const item = products.find((product) => {
      return product.id === id;
    });
    cart.push({
      ...item,
      numberOfUnits: 1, // 장바구니에 담긴 옷 개수
    });
  }
  updateCart();
}

// update cart
function updateCart() {
  renderCartItems();
  renderSubtotal();

  // save cart to local storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

// calculate and render subtotal
function renderSubtotal() {
  let totalPrice = 0,
    totalItems = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });

  subtotalEl.innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(
    2
  )}`;
  totalEl.innerHTML = totalItems;
}

function renderCartItems() {
  cartItemsEl.innerHTML = ""; // clear cart element
  // 아래의 forEach를 통해 cart안에 있는 걸 다시 그려줌
  // innerhtml, innertext 차이 왼쪽꺼는 태그를 판독함
  cart.forEach((item) => {
    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <div class="item-info" onClick="removeItemFromCart(${item.id})">
          <img src="${item.imgSrc}" alt="${item.name}"/>
          <h4>${item.name}</h4>
        </div>
        <div class="unit-price"><small>$</small>${item.price}</div>
        <div class="units">
          <div class="btn minus" onClick="changeNumberOfUnits('minus', ${item.id})">-</div>
          <div class="number">${item.numberOfUnits}</div>
          <div class="btn plus" onClick="changeNumberOfUnits('plus', ${item.id})">+</div>
        </div>
      </div>
    `;
  });
}
// ""와 ''은 중복 사용 불가

// remove items
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  updateCart();
}

// change number of units for an item
function changeNumberOfUnits(action, id) {
  cart = cart.map((item) => {
    // 위의 forEach랑 뭔 차이?
    let numberOfUnits = item.numberOfUnits;

    if (item.id === id) {
      if (action === "minus") {
        if (numberOfUnits > 1) {
          numberOfUnits--;
        } else if (numberOfUnits === 1) {
          alert("remove the this item");
        }
      } else if (action === "plus") {
        if (numberOfUnits < item.instock) {
          numberOfUnits++;
        } else if (numberOfUnits >= item.instock) {
          alert("no more clothes");
        }
      }
    }

    return {
      ...item,
      numberOfUnits, // 프로퍼티 값 동일하면 value 생략 가능
    };
  });
  console.log(cart);
  updateCart();
}
