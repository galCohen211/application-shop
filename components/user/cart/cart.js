function loadCart() {
  const authToken = localStorage.getItem("accessToken");
  const recentlyAddedProductId = localStorage.getItem("recentlyAddedProductId");
  if (!recentlyAddedProductId) {
    $("#products-container").html("<p>No items in cart</p>");
    return;
  }
  fetch(`http://localhost:4000/products/?id=${recentlyAddedProductId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((product) => {
      let specificProduct = product[0];
      console.log(recentlyAddedProductId);
      for (let i = 0; i < product.length; i++) {
        if (product[i]._id == recentlyAddedProductId) {
          specificProduct = product[i];
          break;
        }
      }

      if (specificProduct) {
        const productsHTML = `
          <div class="product" data-id="${specificProduct._id}">
            <div class="img-top-images">
              <img src="${specificProduct.imagePath}" alt="${specificProduct.name}">
            </div>
            <h2>${specificProduct.name}</h2>
            <p>Size: ${specificProduct.size}</p>
            <p>${specificProduct.price} USD</p>
            <button class="delete-btn" onclick="confirmDelete('${specificProduct._id}')">
              Delete
            </button>
          </div>
        `;
        $("#products-container").html(productsHTML);

        document.querySelectorAll(".close-btn").forEach((button) => {
          button.addEventListener("click", function () {
            deleteProductFromCart(specificProduct);
          });
        });
      } else {
        $("#products-container").html("<p>No items in cart</p>");
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
  fetch(`http://localhost:4000/carts/`, {
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
  const userConfirmed = window.confirm("Are you sure you want to remove this item?");
  if (userConfirmed) {
    deleteProductFromCart(productId);
  }
}
