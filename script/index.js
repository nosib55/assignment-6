const loadTreeCategory = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories));
};

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("card-container").classList.add("hidden");
  } else {
    document.getElementById("card-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const removeActive = () => {
  const nameButtons = document.querySelectorAll(".name-btn");
  nameButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadCategory = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`category-btn-${id}`);
      clickBtn.classList.add("active");
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
          <h2 class="text-xl font-bold">${tree.name}</h2>
          <figure class="rounded-lg">
            <img
              src="${tree.image}"
              alt=""
              class="w-full h-48 object-cover"
            />
          </figure>
          <p> <span class="font-semibold">Category:</span> ${tree.category}</p>
          <p> <span class="font-semibold">Price:</span> $${tree.price}</p>
          <p><span class="font-semibold">Description:</span> ${tree.description}</p>
        </div>
    
    `;
  document.getElementById("tree_modal").showModal();
};

const displayTreePlants = (trees) => {
  const treeContainer = document.getElementById("card-container");
  treeContainer.innerHTML = "";
  for (let tree of trees) {
    const treeDiv = document.createElement("div");
    treeDiv.innerHTML = `
    <div class="bg-white space-y-2 p-5 rounded-lg ">
                <figure class="rounded-lg">
                  <img src="${tree.image}" alt="" class="w-full h-48 object-cover" />
                </figure>
                <div>
                  <h2 onclick="loadTreeDetail(${tree.id})" class="cursor-pointer text-xl font-bold">${tree.name}</h2>
                  <p>
                    ${tree.description}
                  </p>
                </div>
                <div class="flex justify-between items-center">
                <div
                  class="btn bg-[#DCFCE7] text-green-700 rounded-full border-none"
                >
                  ${tree.category}
                  
                </div>
                <p class="text-green-700">$${tree.price}</p>
                </div>
                <button 
                  class="btn bg-green-700 text-white rounded-full border-none font-bold w-full"
                >
                  Add to Cart
                </button>
              </div>
    `;
    treeContainer.append(treeDiv);
  }
  manageSpinner(false);
};

const treeContainerCart = document.getElementById("card-container");
treeContainerCart.addEventListener("click", (e) => {
  if (e.target.innerText == "Add to Cart") {
    const treeName = e.target.parentNode.children[1].children[0].innerText;
    
    const treePrice = e.target.parentNode.children[2].children[1].innerText;
    console.log(treeName,treePrice);
    const cartHistory = document.getElementById("card-history");
    const divCart = document.createElement("div");
    divCart.classList.add("flex", "justify-between", "items-center", "bg-green-100", "p-4", "mt-4", "rounded-r-xl");
    divCart.innerHTML = `
      <div>
        <p>${treeName}</p>
        <p>${treePrice}</p>
      </div>
      <div onclick="removeFromCart(this)">❌</div>
    `;
    cartHistory.appendChild(divCart);
  }
});


const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";

  for (let categorie of categories) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="category-btn-${categorie.id}" onclick="loadCategory('${categorie.id}')" class="hover:bg-green-700 hover:text-white btn w-full bg-[#F0FDF4] outline-none border-none name-btn">${categorie.category_name}</button>
    
    `;
    categoryContainer.append(btnDiv);
  }
};

const displayAllTrees = () => {
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const allTrees = data.plants;
      displayTreePlants(allTrees);
    });
};

document.getElementById("allTree-btn").addEventListener("click", () => {
  removeActive();
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const allTrees = data.plants;
      displayTreePlants(allTrees);
    });
});

loadTreeCategory();
displayAllTrees();
