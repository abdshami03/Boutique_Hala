# Boutique Hala - Elegant Abayas

A modern, responsive web application for showcasing elegant abayas. Built with vanilla HTML, CSS, and JavaScript - no frameworks required!

## Features

### 🛍️ Customer Features

- **Beautiful Gallery**: Browse abayas in grid or list view
- **Advanced Filtering**: Filter by size, category, and search by name/description
- **Product Details**: Detailed view with image gallery and product information
- **Contact Options**: Direct contact via phone, email, or WhatsApp
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🔧 Admin Features

- **Admin Dashboard**: Manage inventory with password protection
- **Add New Items**: Easy form to add new abayas with all details
- **Delete Items**: Remove items from inventory
- **Real-time Updates**: Changes reflect immediately across the application

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Supabase account (free tier available)

### Installation

1. **Set up Supabase:**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the contents of `database-setup.sql`
   - Copy your project URL and anon key from Settings > API

2. **Configure the application:**

   - Copy `supabase-config.template.js` to `supabase-config.js`
   - Open `supabase-config.js`
   - Replace `YOUR_SUPABASE_URL` with your project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon key

3. **Set up the database:**

   - Run the SQL commands in `database-setup.sql` in your Supabase SQL Editor

4. **Run the application:**
   - Open `index.html` in your web browser
   - The application will automatically load sample data on first run

### Default Admin Access

- **Username**: Any (not required)
- **Password**: `admin123`

## File Structure

```
hala-boutique/
├── index.html                  # Main HTML file
├── styles.css                  # All styling and responsive design
├── script.js                   # Application logic and functionality
├── supabase-config.template.js # Supabase configuration template
├── database-setup.sql          # Database schema setup

├── .gitignore                  # Git ignore file
└── README.md                   # This file
```

## Usage

### For Customers

1. **Browse**: View all available abayas in the main gallery
2. **Filter**: Use the search bar and filters to find specific items
3. **View Details**: Click "View Details" on any abaya to see more information
4. **Contact**: Use the contact buttons to inquire about items

### For Admins

1. **Login**: Click the "Admin" button and enter the password
2. **Add Items**: Use the form to add new abayas with all details
3. **Manage**: View, edit, or delete existing items
4. **Logout**: Click "Logout" when finished

## Features in Detail

### Gallery View

- **Grid/List Toggle**: Switch between grid and list view modes
- **Search**: Search by name, description, category, or colors
- **Size Filter**: Filter by available sizes (S, M, L, XL)
- **Category Filter**: Filter by abaya categories
- **Active Filters**: Visual display of current filters
- **Results Count**: Shows number of items found

### Product Details

- **Image Gallery**: Multiple images with thumbnail navigation
- **Product Information**: Name, description, category, price
- **Available Sizes**: Visual display of all available sizes
- **Color Options**: Color swatches with names
- **Contact Actions**: Direct contact via phone, email, or WhatsApp

### Admin Dashboard

- **Secure Access**: Password-protected admin area
- **Add New Items**: Comprehensive form for adding abayas
- **Item Management**: View and delete existing items
- **Real-time Updates**: Changes appear immediately

## Data Storage

The application uses **Supabase** as a backend database. This provides:

- ✅ Real-time data synchronization
- ✅ Secure data storage
- ✅ Automatic backups
- ✅ Scalable infrastructure
- ✅ Real-time subscriptions for live updates

## Default Data

The application comes with sample data including:

- Classic Black Abaya
- Embroidered Brown Abaya
- Modern Kimono Style Abaya

## Customization

### Adding Your Logo

Update the logo in `index.html` by replacing the emoji with your own logo:

```html
<div class="nav-logo">🕌</div>
<!-- or -->
<img src="path/to/your/logo.png" alt="Your Logo" class="nav-logo" />
```

### Changing Colors

Modify the CSS variables in `styles.css`:

```css
:root {
  --primary: #8b5cf6; /* Main brand color */
  --background: #fafafa; /* Background color */
  --card: #ffffff; /* Card background */
  /* ... more variables */
}
```

### Adding More Features

The modular JavaScript structure makes it easy to add new features:

- Add new filter types in the `applyFilters()` method
- Extend the admin dashboard with more management tools
- Add new contact methods or social media links

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Performance

- **Lightning Fast**: No framework overhead
- **Small Bundle**: Minimal file sizes
- **Optimized Images**: Lazy loading for better performance
- **Responsive**: Optimized for all screen sizes

## Security Notes

- Admin password is stored in plain text (for demo purposes)
- In production, implement proper authentication
- Consider adding data validation and sanitization

## Contributing

Feel free to contribute improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please contact the development team.

---

**Boutique Hala** - Where elegance meets tradition in every abaya.
