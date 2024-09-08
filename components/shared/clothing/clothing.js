src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
integrity =
  "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo";
crossorigin = "anonymous";

src = "https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js";
integrity =
  "sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1";
crossorigin = "anonymous";

src = "https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js";
integrity =
  "sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM";
crossorigin = "anonymous";

src = "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";

// Black bar's close button appears after 3 seconds
setTimeout(() => {
  const closeBtn = document.getElementById("close-btn-login-footer");
  closeBtn.style.display = "block";
}, 3000);

// Close the black bar with sessionStorage
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("black-bar");
  const closeBtn = document.getElementById("close-btn-login-footer");
  const role = localStorage.getItem("role");

  if (sessionStorage.getItem("black-bar") !== "true") {
    footer.classList.remove("hidden");
  }

  if (role !== null) {
    footer.classList.add("hidden");
    sessionStorage.setItem("black-bar", "true");
  }

  closeBtn.addEventListener("click", () => {
    footer.classList.add("hidden");
    sessionStorage.setItem("black-bar", "true");
  });

  document
    .getElementById("close-product-popup")
    .addEventListener("click", function () {
      document.getElementById("product-popup").style.display = "none";
    });

  // Optional: Close the product popup if clicking outside of it
  window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("product-popup")) {
      document.getElementById("product-popup").style.display = "flex";
    }
  });

  const pathname = window.location.pathname;
  const lastSegment = pathname.split("/").pop();
  const pageNameWithoutExtension = lastSegment.substring(
    0,
    lastSegment.lastIndexOf(".")
  );
  const genderFilterField =
    pageNameWithoutExtension === "men" ? "Male" : "Female";
  $.ajax({
    url: `http://localhost:4000/products/field?gender=${genderFilterField}`,
    type: "GET",
    success: function (data) {
      // Process the retrieved data
      insertProductsHtml(data);
      const filterFieldsArr = [
        { fieldName: "brand", filterContainer: "brands-container" },
        { fieldName: "color", filterContainer: "colors-container" },
        { fieldName: "size", filterContainer: "sizes-container" },
      ];

      filterFieldsArr.forEach((filterField) => {
        insertAvailableFilterField(
          data,
          filterField.fieldName,
          filterField.filterContainer
        );
      });
    },
    error: function (_xhr, _status, error) {
      console.error("Error retrieving products:", error);
    },
  });

  const addToCartButton = document.getElementById("add-to-cart-btn");
  addToCartButton.addEventListener("click", () => {
    const authToken = localStorage.getItem("accessToken");
    fetch("http://localhost:4000/carts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        product: selectedProductId,
        amount: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product added to cart:", data);
        localStorage.setItem("recentlyAddedProductId", selectedProductId);
        window.location.href = "../../user/cart/cart.html";
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  });
});

function insertProductsHtml(data) {
  let productsHTML = "";
  $.each(data, function (index, product) {
    productsHTML += '<div class="product" data-product-index="' + index + '">';
    productsHTML += ' <div class="img-top-images">';
    productsHTML +=
      '  <img src="' + product.imagePath + '" alt="' + product.name + '">';
    productsHTML += " </div>";
    productsHTML += " <h2>" + product.name + "</h2>";
    productsHTML += " <p>Size: " + product.size + "</p>";
    productsHTML += " <p>$" + product.price.toFixed(2) + " USD</p>";
    productsHTML += "</div>";
  });
  $("#products-container").html(productsHTML);

  // Attach click event to each product
  $(".product").click(function () {
    const productIndex = $(this).data("product-index");
    showProductPopup(data[productIndex]);
  });
}

function showProductPopup(product) {
  $("#popup-image").attr("src", product.imagePath);
  $("#popup-image").attr("alt", product.name);
  $("#popup-name").text(product.name);
  $("#popup-size").text("Size: " + product.size);
  $("#popup-price").text("$" + product.price.toFixed(2) + " USD");
  document.getElementById("product-popup").style.display = "flex";
  selectedProductId = product._id;
}

function insertAvailableFilterField(data, filterFieldName, filterElementID) {
  const brandMap = new Map();
  let brandsHTML = "";
  $.each(data, function (_index, product) {
    if (!brandMap.has(product[filterFieldName])) {
      brandMap.set(product[filterFieldName], true);
      brandsHTML += `<li>
        <input type="checkbox" id="${product[filterFieldName]}" value="${product[filterFieldName]}" />
        <label for="${product[filterFieldName]}">${product[filterFieldName]}</label>
      </li>`;
    }
  });

  // Append the product HTML to the container
  $(`#${filterElementID}`).html(brandsHTML);
}

function openMenu(event) {
  event.stopPropagation(); // Prevent the click event from bubbling up to the document
  const dropdowns = document.querySelectorAll(".dropdown-list");

  // Close all other dropdowns
  dropdowns.forEach(function (dropdown) {
    if (dropdown !== event.currentTarget.nextElementSibling) {
      dropdown.classList.remove("show");
    }
  });

  // Toggle the current dropdown
  const dropdown = event.currentTarget.nextElementSibling;
  dropdown.classList.toggle("show");
}

document.addEventListener("click", function (event) {
  const dropdownLists = document.querySelectorAll(".dropdown-list");

  // Close all dropdowns if the click is outside any dropdown
  dropdownLists.forEach(function (list) {
    if (!list.parentElement.contains(event.target)) {
      list.classList.remove("show");
    }
  });
});
