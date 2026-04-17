# Scout

## Overview
Scout is a web app created to help fans experience the World Cup in a way that matches their vibe. Filter by atmosphere, price, crowd size, and more to find a perfect spot for a watch party—whether that's a chill cafe or an electric sports bar.

Hosted Link: https://scout-3e9c2.web.app

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user and venue data.

---

## Features

- Browse a list of curated venues with images and details
- Mark and unmark venues as favorites
- View a personalized list of favorite venues
- Write reviews for others to see
- See upcoming FIFA World Cup games
- Create a personalized profile
- Add venues if you want to host an event
- View a map with pins showing venue locations
- Responsive design for desktop and mobile

---

## Technologies Used

[![My Skills](https://skillicons.dev/icons?i=html,css,js,vite,firebase,figma)](https://skillicons.dev)

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore, [TheSportsDB](https://www.thesportsdb.com/)
- **Libraries**: [Leaflet](https://leafletjs.com)
- **APIs**: [Geoaplify](https://www.geoapify.com)
- **Toolchain**: Trello, Figma
---

## Usage

To run the application locally:

1.  **Clone** the repository.
2.  **Install dependencies** by running `npm install` in the project root directory.
3.  **Start the development server** by running the command: `npm run dev`.
4.  Open your browser and visit the local address shown in your terminal (usually `http://localhost:5173` or similar).

Once the application is running:

## 

1.  Browse the list of popular venues displayed on the main page.
2.  Click on one of the venues or use the search bar to find a venue
3.  Click the heart icon to mark a venue as a favorite.
4.  View your favorite venues in the bookmarked venues section in your profile.
   

---

## Project Structure

```
1800_202610_DTC02/
├── src/
│   ├── main.js
    ├── authentication.js
    ├── createVenue.js
    ├── firebaseConfig.js
    ├── loginSignup.js
    ├── msStackedCards.js
    ├── navbar.js
    ├── searchbar.js
    ├── venue.js
├── styles/
│   └── style.css
├── public/
├── images/
├── index.html
├── package.json
├── README.md
```

---

## Contributors
- **Andy Guo** - BCIT CST Student with a passion for learning programming algorithms and coding structures. Fun fact: Had once went 3 days without sleep.
- **James Cameron Garcia** - BCIT CST Student who is looking to work on his programming foundations. Fun fact: Loves listening to rap music.
- **Fawaz Shariff** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: I can't go a day without breathing.



---

## Acknowledgments

- Venue data and images are used for demonstration purposes only and do not represent real businesses, their owners, or affiliates.
- Icons sourced from SVG Repo. Images are the property of their respective owners and are used here solely for educational/demonstration purposes.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- Icons sourced from [svgrepo](https://www.svgrepo.com) and images whoever owns them....

---

## Limitations and Future Work

### Limitations

- Limited venue details (e.g., no live location data).
- No authentication process for creating a venue.
- User authentication is minimal and does not include account recovery or third-party sign-in options.
- Accessibility features can be further improved.

### Future Work

- Implement routing from user's location to a selected venue.
- Add edit functionality for reviews and created venues
- Create a dark mode for better usability in low-light conditions.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
