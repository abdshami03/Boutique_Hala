// Data Manager Class with Supabase
class DataManager {
  constructor() {
    this.eventName = "boutiqueDataChanged";
    this.initialize();
  }

  // Initialize with default data if database is empty
  async initialize() {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .limit(1);

      if (error) {
        console.error("Error checking database:", error);
        return;
      }

      if (!data || data.length === 0) {
        await this.loadDefaultData();
      }
    } catch (error) {
      console.error("Error initializing:", error);
    }
  }

  // Load default data for initial setup
  async loadDefaultData() {
    const defaultItems = [
      {
        name: "Classic Black Abaya",
        description:
          "Elegant classic black abaya with flowing silhouette, perfect for any occasion. Made from premium quality fabric with attention to detail.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black"],
        images: [
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=600&fit=crop",
        ],
        videos: [],
        category: "Classic Abayas",
        price: "$120",
      },
      {
        name: "Embroidered Brown Abaya",
        description:
          "Luxurious brown abaya featuring delicate embroidery and modern cut. Crafted for the discerning woman who appreciates elegance.",
        sizes: ["S", "M", "L"],
        colors: ["Brown", "Beige"],
        images: [
          "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400&h=600&fit=crop",
        ],
        videos: [],
        category: "Embroidered Collection",
        price: "$180",
      },
      {
        name: "Modern Kimono Style Abaya",
        description:
          "Contemporary kimono-inspired abaya with wide sleeves and minimalist design. Perfect blend of tradition and modernity.",
        sizes: ["M", "L", "XL"],
        colors: ["Charcoal", "Navy"],
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
        ],
        videos: [],
        category: "Modern Collection",
        price: "$155",
      },
    ];

    for (const item of defaultItems) {
      await this.addItem(item);
    }
  }

  // Get all items from Supabase
  async getAllItems() {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching items:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error reading from database:", error);
      return [];
    }
  }

  // Get item by ID
  async getItemById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching item:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error reading item from database:", error);
      return null;
    }
  }

  // Add new item
  async addItem(item) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([item])
        .select()
        .single();

      if (error) {
        console.error("Error adding item:", error);
        return null;
      }

      this.dispatchDataChangedEvent();
      return data.id;
    } catch (error) {
      console.error("Error adding item:", error);
      return null;
    }
  }

  // Update existing item
  async updateItem(id, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating item:", error);
        return false;
      }

      this.dispatchDataChangedEvent();
      return true;
    } catch (error) {
      console.error("Error updating item:", error);
      return false;
    }
  }

  // Delete item
  async deleteItem(id) {
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

      if (error) {
        console.error("Error deleting item:", error);
        return false;
      }

      this.dispatchDataChangedEvent();
      return true;
    } catch (error) {
      console.error("Error deleting item:", error);
      return false;
    }
  }

  // Get unique categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }

      const categories = data.map((item) => item.category);
      return [...new Set(categories)].sort();
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  }

  // Get unique colors
  async getColors() {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select("colors");

      if (error) {
        console.error("Error fetching colors:", error);
        return [];
      }

      const colors = data.flatMap((item) => item.colors);
      return [...new Set(colors)].sort();
    } catch (error) {
      console.error("Error getting colors:", error);
      return [];
    }
  }

  // Get unique sizes
  async getSizes() {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select("sizes");

      if (error) {
        console.error("Error fetching sizes:", error);
        return [];
      }

      const sizes = data.flatMap((item) => item.sizes);
      return [...new Set(sizes)].sort();
    } catch (error) {
      console.error("Error getting sizes:", error);
      return [];
    }
  }

  // Dispatch data changed event
  dispatchDataChangedEvent() {
    this.getAllItems().then((items) => {
      const event = new CustomEvent(this.eventName, {
        detail: { items },
      });
      window.dispatchEvent(event);
    });
  }

  // Listen for data changes
  onDataChanged(callback) {
    const handler = (event) => {
      callback(event.detail.items);
    };
    window.addEventListener(this.eventName, handler);
    return () => window.removeEventListener(this.eventName, handler);
  }

  // Set up real-time subscriptions
  setupRealtime() {
    supabase
      .channel("abayas_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE_NAME },
        () => {
          this.dispatchDataChangedEvent();
        }
      )
      .subscribe();
  }
}

// Toast Notification System
class ToastManager {
  constructor() {
    this.container = document.getElementById("toastContainer");
  }

  show(options) {
    const toast = document.createElement("div");
    toast.className = `toast ${options.variant || "info"}`;

    toast.innerHTML = `
            <div class="toast-title">${options.title}</div>
            ${
              options.description
                ? `<div class="toast-description">${options.description}</div>`
                : ""
            }
        `;

    this.container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);

    return toast;
  }
}

// Main Application Class
class BoutiqueHalaApp {
  constructor() {
    this.dataManager = new DataManager();
    this.toastManager = new ToastManager();
    this.currentView = "gallery";
    this.currentItem = null;
    this.filteredItems = [];
    this.viewMode = "grid";

    this.initializeEventListeners();
    this.loadGallery();
  }

  initializeEventListeners() {
    // Navigation
    document
      .getElementById("backBtn")
      .addEventListener("click", () => this.showGallery());
    document
      .getElementById("adminBtn")
      .addEventListener("click", () => this.showAdminLogin());

    // Gallery filters
    document
      .getElementById("searchInput")
      .addEventListener("input", (e) => this.handleSearch(e.target.value));
    document
      .getElementById("sizeFilter")
      .addEventListener("change", (e) => this.handleSizeFilter(e.target.value));
    document
      .getElementById("categoryFilter")
      .addEventListener("change", (e) =>
        this.handleCategoryFilter(e.target.value)
      );
    document
      .getElementById("clearFiltersBtn")
      .addEventListener("click", () => this.clearFilters());
    document
      .getElementById("clearAllFiltersBtn")
      .addEventListener("click", () => this.clearFilters());

    // View mode
    document
      .getElementById("gridViewBtn")
      .addEventListener("click", () => this.setViewMode("grid"));
    document
      .getElementById("listViewBtn")
      .addEventListener("click", () => this.setViewMode("list"));

    // Admin
    document
      .getElementById("adminLoginForm")
      .addEventListener("submit", (e) => this.handleAdminLogin(e));
    document
      .getElementById("logoutBtn")
      .addEventListener("click", () => this.handleLogout());
    document
      .getElementById("addItemForm")
      .addEventListener("submit", (e) => this.handleAddItem(e));

    // Data change listener
    this.dataManager.onDataChanged(() => {
      this.loadGallery();
      this.loadAdminItems();
    });

    // Set up real-time subscriptions
    this.dataManager.setupRealtime();
  }

  // Gallery Management
  async loadGallery() {
    const items = await this.dataManager.getAllItems();
    this.filteredItems = items;
    await this.updateFilters();
    this.renderGallery();
    this.updateResultsCount();
  }

  async updateFilters() {
    const sizes = await this.dataManager.getSizes();
    const categories = await this.dataManager.getCategories();

    // Update size filter
    const sizeFilter = document.getElementById("sizeFilter");
    sizeFilter.innerHTML = '<option value="all">All Sizes</option>';
    sizes.forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      sizeFilter.appendChild(option);
    });

    // Update category filter
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  async handleSearch(query) {
    await this.applyFilters();
  }

  async handleSizeFilter(size) {
    await this.applyFilters();
  }

  async handleCategoryFilter(category) {
    await this.applyFilters();
  }

  async applyFilters() {
    const searchQuery = document
      .getElementById("searchInput")
      .value.toLowerCase()
      .trim();
    const selectedSize = document.getElementById("sizeFilter").value;
    const selectedCategory = document.getElementById("categoryFilter").value;

    let filtered = await this.dataManager.getAllItems();

    // Filter by size
    if (selectedSize !== "all") {
      filtered = filtered.filter((item) => item.sizes.includes(selectedSize));
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery) ||
          item.colors.some((color) => color.toLowerCase().includes(searchQuery))
      );
    }

    this.filteredItems = filtered;
    this.renderGallery();
    this.updateResultsCount();
    this.updateActiveFilters();
  }

  async clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("sizeFilter").value = "all";
    document.getElementById("categoryFilter").value = "all";
    await this.applyFilters();
  }

  updateActiveFilters() {
    const searchQuery = document.getElementById("searchInput").value.trim();
    const selectedSize = document.getElementById("sizeFilter").value;
    const selectedCategory = document.getElementById("categoryFilter").value;
    const hasActiveFilters =
      selectedSize !== "all" ||
      selectedCategory !== "all" ||
      searchQuery !== "";

    const activeFiltersContainer = document.getElementById("activeFilters");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");

    if (hasActiveFilters) {
      activeFiltersContainer.style.display = "flex";
      clearFiltersBtn.style.display = "flex";

      let badges = "";
      if (selectedSize !== "all") {
        badges += `<span class="filter-badge">Size: ${selectedSize}</span>`;
      }
      if (selectedCategory !== "all") {
        badges += `<span class="filter-badge">Category: ${selectedCategory}</span>`;
      }
      if (searchQuery) {
        badges += `<span class="filter-badge">Search: "${searchQuery}"</span>`;
      }
      activeFiltersContainer.innerHTML = badges;
    } else {
      activeFiltersContainer.style.display = "none";
      clearFiltersBtn.style.display = "none";
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    const gridBtn = document.getElementById("gridViewBtn");
    const listBtn = document.getElementById("listViewBtn");
    const galleryGrid = document.getElementById("galleryGrid");

    if (mode === "grid") {
      gridBtn.classList.add("active");
      listBtn.classList.remove("active");
      galleryGrid.classList.remove("list-view");
    } else {
      listBtn.classList.add("active");
      gridBtn.classList.remove("active");
      galleryGrid.classList.add("list-view");
    }

    this.renderGallery();
  }

  renderGallery() {
    const galleryGrid = document.getElementById("galleryGrid");
    const emptyState = document.getElementById("emptyState");

    if (this.filteredItems.length === 0) {
      galleryGrid.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    galleryGrid.style.display = "grid";
    emptyState.style.display = "none";

    galleryGrid.innerHTML = this.filteredItems
      .map((item) => this.createAbayaCard(item))
      .join("");
  }

  createAbayaCard(item) {
    const isListView = this.viewMode === "list";
    const listClass = isListView ? "list-view" : "";

    return `
            <div class="abaya-card ${listClass}" data-item-id="${item.id}">
                <div class="card-image-container">
                    <img src="${item.images[0]}" alt="${
      item.name
    }" class="card-image" loading="lazy">
                    <div class="card-overlay">
                        <button class="favorite-btn" onclick="app.toggleFavorite(event, '${
                          item.id
                        }')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>
                    ${
                      item.price
                        ? `<div class="price-badge">${item.price}</div>`
                        : ""
                    }
                </div>
                <div class="card-content">
                    <div class="card-category">${item.category}</div>
                    <h3 class="card-name">${item.name}</h3>
                    <p class="card-description">${item.description}</p>
                    <div class="card-sizes">
                        ${item.sizes
                          .map(
                            (size) => `<span class="size-badge">${size}</span>`
                          )
                          .join("")}
                    </div>
                    <div class="card-colors">
                        <span class="colors-label">Colors:</span>
                        <div class="color-dots">
                            ${item.colors
                              .map(
                                (color) => `
                                <div class="color-dot" style="background-color: ${this.getColorValue(
                                  color
                                )}" title="${color}"></div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                    <button class="view-details-btn" onclick="app.showItemDetail('${
                      item.id
                    }')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        View Details
                    </button>
                </div>
            </div>
        `;
  }

  getColorValue(color) {
    const colorMap = {
      black: "#000",
      brown: "#8B4513",
      beige: "#F5F5DC",
      white: "#FFF",
      navy: "#000080",
      charcoal: "#36454F",
    };
    return colorMap[color.toLowerCase()] || "#CCC";
  }

  updateResultsCount() {
    const count = this.filteredItems.length;
    const text = `${count} ${count === 1 ? "abaya" : "abayas"} found`;
    document.getElementById("resultsCount").textContent = text;
  }

  toggleFavorite(event, itemId) {
    event.stopPropagation();
    const btn = event.currentTarget;
    btn.classList.toggle("favorited");

    this.toastManager.show({
      title: "Favorite updated",
      description: "Item added to favorites",
      variant: "success",
    });
  }

  // Item Detail Management
  async showItemDetail(itemId) {
    const item = await this.dataManager.getItemById(itemId);
    if (!item) {
      this.toastManager.show({
        title: "Item not found",
        description: "The requested abaya could not be found.",
        variant: "error",
      });
      return;
    }

    this.currentItem = item;
    this.currentView = "detail";
    this.renderItemDetail(item);
    this.showView("itemDetailView");
    document.getElementById("backBtn").style.display = "flex";
  }

  renderItemDetail(item) {
    // Set basic info
    document.getElementById("itemCategory").textContent = item.category;
    document.getElementById("itemName").textContent = item.name;
    document.getElementById("itemDescription").textContent = item.description;

    // Set price
    const priceElement = document.getElementById("itemPrice");
    if (item.price) {
      priceElement.textContent = item.price;
      priceElement.style.display = "block";
    } else {
      priceElement.style.display = "none";
    }

    // Set sizes
    const sizesContainer = document.getElementById("itemSizes");
    sizesContainer.innerHTML = item.sizes
      .map((size) => `<span class="size-badge">${size}</span>`)
      .join("");

    // Set colors
    const colorsContainer = document.getElementById("itemColors");
    colorsContainer.innerHTML = item.colors
      .map(
        (color) => `
            <div class="color-item">
                <div class="color-dot-large" style="background-color: ${this.getColorValue(
                  color
                )}"></div>
                <span class="color-name">${color}</span>
            </div>
        `
      )
      .join("");

    // Set main image
    document.getElementById("mainImage").src = item.images[0];
    document.getElementById("mainImage").alt = item.name;

    // Set thumbnail gallery
    const thumbnailGallery = document.getElementById("thumbnailGallery");
    if (item.images.length > 1) {
      thumbnailGallery.innerHTML = item.images
        .map(
          (image, index) => `
                <button class="thumbnail-btn ${
                  index === 0 ? "active" : ""
                }" onclick="app.selectImage(${index})">
                    <img src="${image}" alt="${item.name} view ${
            index + 1
          }" class="thumbnail-img">
                </button>
            `
        )
        .join("");
      thumbnailGallery.style.display = "flex";
    } else {
      thumbnailGallery.style.display = "none";
    }

    // Set up contact buttons
    this.setupContactButtons();
  }

  selectImage(index) {
    const item = this.currentItem;
    if (!item || !item.images[index]) return;

    // Update main image
    document.getElementById("mainImage").src = item.images[index];

    // Update active thumbnail
    const thumbnails = document.querySelectorAll(".thumbnail-btn");
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  setupContactButtons() {
    const contactButtons = document.querySelectorAll(".contact-btn");
    contactButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const method = e.currentTarget.dataset.method;
        this.handleContactInquiry(method);
      });
    });
  }

  handleContactInquiry(method) {
    const itemName = this.currentItem?.name || "Selected Abaya";
    const message = `Hello! I'm interested in the ${itemName}. Could you please provide more information?`;

    switch (method) {
      case "phone":
        window.location.href = "tel:+1234567890";
        break;
      case "email":
        window.location.href = `mailto:info@boutiquehala.com?subject=Inquiry about ${itemName}&body=${encodeURIComponent(
          message
        )}`;
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/1234567890?text=${encodeURIComponent(message)}`,
          "_blank"
        );
        break;
    }

    this.toastManager.show({
      title: "Contact initiated",
      description: `Opening ${method} to discuss this abaya...`,
      variant: "info",
    });
  }

  // Admin Management
  showAdminLogin() {
    this.currentView = "adminLogin";
    this.showView("adminLoginView");
    document.getElementById("backBtn").style.display = "flex";
  }

  handleAdminLogin(event) {
    event.preventDefault();
    const password = document.getElementById("adminPassword").value;

    // Simple password check (in real app, this would be server-side)
    if (password === "admin123") {
      this.showAdminDashboard();
      this.toastManager.show({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
        variant: "success",
      });
    } else {
      this.toastManager.show({
        title: "Login failed",
        description: "Invalid password",
        variant: "error",
      });
    }
  }

  showAdminDashboard() {
    this.currentView = "adminDashboard";
    this.showView("adminDashboardView");
    this.loadAdminItems();
  }

  async loadAdminItems() {
    const items = await this.dataManager.getAllItems();
    const container = document.getElementById("adminItemsList");

    container.innerHTML = items
      .map(
        (item) => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <div class="admin-item-name">${item.name}</div>
                    <div class="admin-item-category">${item.category}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-action-btn edit-btn" onclick="app.editItem('${item.id}')">Edit</button>
                    <button class="admin-action-btn delete-btn" onclick="app.deleteItem('${item.id}')">Delete</button>
                </div>
            </div>
        `
      )
      .join("");
  }

  async handleAddItem(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const item = {
      name: formData.get("itemNameInput"),
      category: formData.get("itemCategoryInput"),
      description: formData.get("itemDescriptionInput"),
      price: formData.get("itemPriceInput"),
      sizes: formData
        .get("itemSizesInput")
        .split(",")
        .map((s) => s.trim()),
      colors: formData
        .get("itemColorsInput")
        .split(",")
        .map((c) => c.trim()),
      images: formData
        .get("itemImagesInput")
        .split(",")
        .map((i) => i.trim()),
      videos: [],
    };

    await this.dataManager.addItem(item);
    event.target.reset();

    this.toastManager.show({
      title: "Item added",
      description: "New abaya has been added successfully",
      variant: "success",
    });
  }

  editItem(itemId) {
    // Implementation for editing items
    this.toastManager.show({
      title: "Edit feature",
      description: "Edit functionality coming soon",
      variant: "info",
    });
  }

  async deleteItem(itemId) {
    if (confirm("Are you sure you want to delete this item?")) {
      await this.dataManager.deleteItem(itemId);
      this.toastManager.show({
        title: "Item deleted",
        description: "Abaya has been removed successfully",
        variant: "success",
      });
    }
  }

  handleLogout() {
    this.showGallery();
    this.toastManager.show({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "info",
    });
  }

  // View Management
  showGallery() {
    this.currentView = "gallery";
    this.showView("galleryView");
    document.getElementById("backBtn").style.display = "none";
  }

  showView(viewId) {
    // Hide all views
    const views = [
      "galleryView",
      "itemDetailView",
      "adminLoginView",
      "adminDashboardView",
    ];
    views.forEach((view) => {
      document.getElementById(view).style.display = "none";
    });

    // Show requested view
    document.getElementById(viewId).style.display = "block";
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new BoutiqueHalaApp();
});
