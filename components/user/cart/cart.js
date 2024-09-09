var cartId = null;

function loadCart() {
  const authToken = localStorage.getItem("accessToken");
  const recentlyAddedProductId = localStorage.getItem("recentlyAddedProductId");
  if (!recentlyAddedProductId) {
    $("#products-container").html("<p>No items in cart</p>");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  const payload = JSON.parse(atob(accessToken.split(".")[1]));
  const userId = payload.userId;

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
        fetch(`http://localhost:4000/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((products) => {
            const cartProducts = products
              .map((product) => {
                const amount = cartDetails.cartItems.filter(
                  (cartItem) => cartItem.product === product._id
                ).length;

                // If the item appears in array2, add the amount field
                if (amount > 0) {
                  return { ...product, amount }; // Add the 'amount' field
                }
              })
              .filter(Boolean); // Remove undefined values

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
                  <p>${cartProduct.price} USD</p>
                  <p>Amount: ${cartProduct.amount}</p>
                  <button class="delete-btn" onclick="confirmDelete('${cartProduct._id}')">
                    Delete
                  </button>
                </div>
              `;
              });
              $("#products-container").html(productsHTML);
            } else {
              $("#products-container").html("<p>No items in cart</p>");
            }
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      $("#products-container").html("<p>Error loading cart</p>");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
});

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
