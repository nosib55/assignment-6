const loadTreeCategory = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories));
};

const manageSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  const treeContainer = document.getElementById("card-container");
  if (status) {
    spinner.classList.remove("hidden");
    treeContainer.classList.add("hidden");
  } else {
    treeContainer.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
};

const removeActive = () => {
  document.querySelectorAll(".name-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
};

const loadCategory = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`category-btn-${id}`);
      if (clickBtn) clickBtn.classList.add("active");
      displayTreePlants(data.plants);
    });
};

const loadTreeDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayTreeDetails(details.plants);
};

const displayTreeDetails = (tree) => {
  const detailContainer = document.getElementById("details-container");
  detailContainer.innerHTML = `
    <div class="space-y-3">
      <h2 class="text-xl font-bold">${tree.name || "No Name"}</h2>
      <figure class="rounded-lg">
        <img src="${tree.image}" alt="" class="w-full h-48 object-cover" />
      </figure>
      <p><span class="font-semibold">Category:</span> ${tree.category || "N/A"}</p>
      <p><span class="font-semibold">Price:</span> $${tree.price || 0}</p>
      <p><span class="font-semibold">Description:</span> ${tree.description || "No description available"}</p>
    </div>
  `;
  document.getElementById("tree_modal").showModal();
};

const displayTreePlants = (trees) => {
  const treeContainer = document.getElementById("card-container");
  treeContainer.innerHTML = "";
  trees.forEach((tree) => {
    const treeDiv = document.createElement("div");
    treeDiv.innerHTML = `
      <div class="bg-white space-y-2 p-5 rounded-lg">
        <figure class="rounded-lg">
          <img src="${tree.image}" alt="" class="w-full h-48 object-cover" />
        </figure>
        <div>
          <h2 onclick="loadTreeDetail('${tree.id}')" class="cursor-pointer text-xl font-bold">${tree.name}</h2>
          <p>${tree.description}</p>
        </div>
        <div class="flex justify-between items-center">
          <div class="btn bg-[#DCFCE7] text-green-700 rounded-full border-none">${tree.category}</div>
          <p class="text-green-700">$${tree.price}</p>
        </div>
        <button class="btn bg-green-700 text-white rounded-full border-none font-bold w-full add-to-cart">Add to Cart</button>
      </div>
    `;
    treeContainer.append(treeDiv);
  });
  manageSpinner(false);
};

const updateTotalPrice = () => {
  const prices = document.querySelectorAll("#card-history .item-price");
  let total = 0;
  prices.forEach((p) => {
    const priceValue = parseFloat(p.innerText.replace("$", "")) || 0;
    total += priceValue;
  });
  document.getElementById("total-price").innerText = `Total: $${total}`;
};

document.getElementById("card-container").addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const parent = e.target.closest("div");
    const treeName = parent.querySelector("h2").innerText;
    const treePrice = parent.querySelector("div.flex p.text-green-700").innerText;

    const cartHistory = document.getElementById("card-history");
    const divCart = document.createElement("div");
    divCart.classList.add("flex", "justify-between", "items-center", "bg-green-100", "p-4", "mt-4", "rounded-r-xl");
    divCart.innerHTML = `
      <div>
        <p>${treeName}</p>
        <p class="item-price">${treePrice}</p>
      </div>
      <div class="cursor-pointer remove-item">❌</div>
    `;
    cartHistory.appendChild(divCart);
    updateTotalPrice();
  }
});

document.getElementById("card-history").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    e.target.parentElement.remove();
    updateTotalPrice();
  }
});

const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";
  categories.forEach((category) => {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
      <button id="category-btn-${category.id}" onclick="loadCategory('${category.id}')" class="hover:bg-green-700 hover:text-white btn w-full bg-[#F0FDF4] outline-none border-none name-btn">${category.category_name}</button>
    `;
    categoryContainer.append(btnDiv);
  });
};

const displayAllTrees = () => {
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayTreePlants(data.plants);
    });
};

document.getElementById("allTree-btn").addEventListener("click", () => {
  removeActive();
  document.getElementById("allTree-btn").classList.add("active");
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayTreePlants(data.plants);
    });
});

loadTreeCategory();
displayAllTrees();