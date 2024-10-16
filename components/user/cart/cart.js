var cartId = null;
var cartTotalPrice = 0;
var cartProducts = [];
//Load product
function loadCart() {
  const authToken = localStorage.getItem("accessToken");
  const payload = JSON.parse(atob(authToken.split(".")[1]));
  const userId = payload.userId;

  // Fetching the whole cart
  fetch(`http://localhost:4000/carts/?id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((cartDetails) => {
      cartId = cartDetails.cart._id;
      if (cartDetails?.cartItems) {
        // Fetching whole products
        fetch(`http://localhost:4000/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((products) => {
            // Looping through all the products
            cartProducts = products
              .map((product) => {
                // Get the product from the existing cart (to get its amount in the cart)
                const cartItem = cartDetails.cartItems.find(
                  (cartItem) => cartItem.product === product._id
                );
                if (cartItem) {
                  // Include the cartItem ID and amount in the returned object
                  return { ...product, amount: cartItem.amount, cartItemId: cartItem._id }; // Add the 'cartItemId' field
                }
              })
              .filter(Boolean); // Remove undefined values - products that not in the cart

            //Total price calculation
            cartTotalPrice = cartDetails.cartItems
              .reduce((accumulator, currentValue) => {
                return accumulator + currentValue.price;
              }, 0)
              .toFixed(2);

            if (cartProducts?.length) {
              let productsHTML = "";
              cartProducts.forEach((cartProduct) => {
                productsHTML += `
                <div class="product" data-id="${cartProduct._id}">
                <div class="img-top-images">
                  <img src="${cartProduct.imagePath}" alt="${cartProduct.name}">
                </div>
                <h2>${cartProduct.name}</h2>
                <p>Size: ${cartProduct.size}</p>
                <p>${cartProduct.price} $</p>
               <p class="amount-controls">
                  <button class="btn btn-light" onclick="updateAmount('${cartProduct._id}', -1)">-</button>
                  <span id="amount-${cartProduct._id}">${cartProduct.amount}</span>
                  <button class="btn btn-light" onclick="updateAmount('${cartProduct._id}', 1)">+</button>
                </p>
                <button class="delete-btn" onclick="confirmDelete('${cartProduct._id}')">
                  Delete
                </button>
              </div>
              `;
              });
              $("#products-container").html(productsHTML);
              document.getElementById(
                "total-cart-price"
              ).innerText = `Cart total price: ${cartTotalPrice}$`;
            } else {
              document.getElementById(
                "total-cart-price"
              ).innerText = `No items in cart`;
              document.getElementById("open-checkout-btn").disabled = true;
            }
          });
      } else {
        document.getElementById(
          "total-cart-price"
        ).innerText = `No items in cart`;

        document.getElementById("open-checkout-btn").disabled = true;
      }

      document.getElementById("total-cart-price-container").style.display =
        "flex";
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      $("#products-container").html("<p>Error loading cart</p>");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
});

function updateAmount(productId, change) {
  const authToken = localStorage.getItem("accessToken");
  
  // Find the product in the cart
  const cartProduct = cartProducts.find(product => product._id === productId);

  // Ensure cartProduct exists
  if (!cartProduct) {
    alert("Cart item not found");
    return;
  }

  const cartItemId = cartProduct.cartItemId;

  // Get the current amount for the cart product
  const currentAmount = parseInt(document.getElementById(`amount-${productId}`).innerText);

  const newAmount = currentAmount + change;

  // Validate new amount
  if (newAmount <= 0) {
    alert("Amount cannot be zero or less.");
    return;
  }

  // Check if the new amount exceeds the available product quantity
  if (newAmount > cartProduct.quantity) {
    alert(`Cannot add more than ${cartProduct.quantity} items. Available stock: ${cartProduct.quantity}`);
    return;
  }

  // Update amount in the backend
  fetch(`http://localhost:4000/carts/item/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ amount: newAmount }),
  })
    .then((response) => response.json())
    .then((updatedCartItem) => {
      document.getElementById(`amount-${productId}`).innerText = newAmount;

      // Update the amount in the cartProducts array
      cartProduct.amount = newAmount; 

      // Recalculate and update cart total price
      cartTotalPrice = cartProducts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.amount;
      }, 0).toFixed(2);

      // Update total price in the UI
      document.getElementById("total-cart-price").innerText = `Cart total price: ${cartTotalPrice}$`;
    })
    .catch((error) => {
      console.error("Error updating product amount:", error);
    });
}

//Delete product from cart
function deleteProductFromCart(productId) {
  const authToken = localStorage.getItem("accessToken");
  fetch(`http://localhost:4000/carts/?item=${productId}&cart=${cartId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      const productElement = document.querySelector(
        `.product[data-id="${productId}"]`
      );
      if (productElement) {
        productElement.remove();
        cartProducts = cartProducts.filter(
          (product) => product._id !== productId
        );

        //Total price calculation
        cartTotalPrice = cartProducts
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price * currentValue.amount;
          }, 0)
          .toFixed(2);

        if (cartProducts?.length) {
          document.getElementById(
            "total-cart-price"
          ).innerText = `Cart total price: ${cartTotalPrice}$`;
        } else {
          document.getElementById(
            "total-cart-price"
          ).innerText = `No items in cart`;
          document.getElementById("open-checkout-btn").disabled = true;
        }
      } else {
        console.error("Product element not found");
      }
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
    });
}

//Confirm delete product
function confirmDelete(productId) {
  const userConfirmed = window.confirm(
    "Are you sure you want to remove this item?"
  );
  if (userConfirmed) {
    deleteProductFromCart(productId);
  }
}

function openSubmitForm() {
  showPopup();
}

function submitOrder() {
  const city = document.getElementById("City").value;
  const street = document.getElementById("Street").value;
  const creditcard = document.getElementById("creditcard").value;
  const authToken = localStorage.getItem("accessToken");
  const payload = JSON.parse(atob(authToken.split(".")[1]));
  const user = payload.userId;
  const data = {
    city,
    street,
    creditcard,
    totalPrice: parseFloat(cartTotalPrice),
    user,
    cart: cartId,
  };

  fetch(`http://localhost:4000/orders`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.orderSubmitted) {
        closePopup();
        cartId = null;
        cartTotalPrice = 0;
        cartProducts = [];
        loadCart();
        const productContainer = document.getElementById("products-container");
        const productElements = productContainer.querySelectorAll(".product");
        productElements.forEach((product) => {
          productContainer.removeChild(product);
        });
        document.getElementById(
          "total-cart-price"
        ).innerText = `No items in cart`;

      }
    })
    .catch((error) => {
      alert("Error occurred while placing the order :/");
      console.error(error);
    });
}

// This function shows the popup on screen
function showPopup() {
  document.getElementById("popup").style.display = "flex";
}

// Function to close the popup when the close button is clicked
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Close the popup when the close button is clicked
document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", closePopup);
});
