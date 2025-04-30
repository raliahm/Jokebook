document.addEventListener("DOMContentLoaded", () => {
    const randomDiv = document.getElementById("random-joke");
    const refreshBtn = document.getElementById("refresh-random");
    const categoryList = document.getElementById("category-list");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchLimit = document.getElementById("search-limit");
    const jokeResults = document.getElementById("joke-results");
    const addForm = document.getElementById("add-joke-form");
    const addedJokes = document.getElementById("added-jokes");
  
    function displayJoke(container, joke) {
      const li = document.createElement("li");
      li.textContent = `${joke.setup} — ${joke.delivery}`;
      container.appendChild(li);
    }
  
    async function loadRandomJoke() {
      const res = await fetch("/jokebook/random");
      const joke = await res.json();
      randomDiv.textContent = `${joke.setup} — ${joke.delivery}`;
    }
  
    async function loadCategories() {
      const res = await fetch("/jokebook/categories");
      const categories = await res.json();
      categoryList.innerHTML = '';
      categories.forEach(cat => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.addEventListener("click", () => searchCategory(cat));
        li.appendChild(btn);
        categoryList.appendChild(li);
      });
    }
  
    async function searchCategory(category, limit = "") {
      const url = limit ? `/jokebook/joke/${category}?limit=${limit}` : `/jokebook/joke/${category}`;
      const res = await fetch(url);
      const jokes = await res.json();
      jokeResults.innerHTML = '';
      if (Array.isArray(jokes)) {
        jokes.forEach(j => displayJoke(jokeResults, j));
      } else {
        jokeResults.textContent = jokes.error || "No jokes found.";
      }
    }
  
    async function addJoke(event) {
      event.preventDefault();
      const category = document.getElementById("add-category").value;
      const setup = document.getElementById("add-setup").value;
      const delivery = document.getElementById("add-delivery").value;
  
      const res = await fetch("/jokebook/joke/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, setup, delivery })
      });
  
      const data = await res.json();
      addedJokes.innerHTML = '';
      data.forEach(j => displayJoke(addedJokes, j));
      addForm.reset();
    }
  
    // Initial load
    loadRandomJoke();
    loadCategories();
  
    // Event listeners
    refreshBtn.addEventListener("click", loadRandomJoke);
  
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const category = searchInput.value.trim();
      const limit = searchLimit.value.trim();
      if (category) {
        searchCategory(category, limit);
      }
    });
  
    addForm.addEventListener("submit", addJoke);
  });
  