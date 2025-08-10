# FindMeNow - Missing Persons Finder

A React + TypeScript web application for reporting and finding missing persons, built with Tailwind CSS and Firebase.

## Features

- **Report Missing Person**: Submit detailed reports with photos
- **Search & Filter**: Real-time search through missing person reports
- **Responsive Design**: Mobile-friendly interface
- **Photo Upload**: Firebase Storage integration for photo management
- **Real-time Updates**: Firebase Firestore for data persistence

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore + Firebase Storage
- **Build Tool**: Vite
- **Package Manager**: npm

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore and Storage enabled

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd findmenow
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon
   - Copy the config object

### 3. Update Firebase Config

Edit `src/firebase/config.ts` and replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

### 4. Firebase Security Rules

Update your Firestore security rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /missing-persons/{document} {
      allow read, write: if true; // For development - customize for production
    }
  }
}
```

Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /missing-persons/{allPaths=**} {
      allow read, write: if true; // For development - customize for production
    }
  }
}
```

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
│   ├── Layout.tsx      # Main layout with header/footer
│   ├── MissingList.tsx # Display missing persons
│   ├── ReportMissingPerson.tsx # Form for reporting
│   └── SearchBar.tsx   # Search functionality
├── firebase/            # Firebase configuration
│   └── config.ts       # Firebase setup
├── services/            # Business logic
│   └── firebaseService.ts # Firebase operations
├── types/               # TypeScript type definitions
│   └── index.ts        # Interface definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Usage

### Reporting a Missing Person

1. Click on "Report Missing Person" tab
2. Fill out the form with:
   - Full Name
   - Last Seen Location
   - Description (age, height, clothing, etc.)
   - Photo upload
3. Submit the report

### Searching for Missing Persons

1. Use the search bar to filter by name or location
2. Browse through the responsive grid of missing person cards
3. Each card shows photo, name, location, and description

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new components in `src/components/`
2. Add TypeScript interfaces in `src/types/`
3. Implement Firebase services in `src/services/`
4. Update the main App component as needed

## Production Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure Firebase security rules are properly configured
4. Consider implementing user authentication for production use

## Security Considerations

- **Firebase Rules**: Customize security rules based on your requirements
- **Photo Validation**: Implement server-side image validation
- **Rate Limiting**: Consider implementing rate limiting for submissions
- **User Authentication**: Add user authentication for production use

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
