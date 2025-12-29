# Calidad Cloud Test Ionic - Open Library Books App

A modern Book Library application built with Ionic 7+ and Angular 17+ following Clean Architecture principles. Integrates with OpenLibrary API for book discovery with offline-first SQLite storage and complete internationalization support.

## 🌍 Internationalization (i18n)

### Complete Bilingual Support

The application features **complete internationalization** eliminating "Espanglish" and providing professional support for **Spanish** and **English**.

#### ✅ i18n Features Implemented

- **I18nService**: Centralized language management using Angular Signals
- **Persistence**: Language preference saved in localStorage
- **Default Language**: Spanish (es)
- **Supported Languages**: Spanish (es) and English (en)
- **Reactive Navigation**: Menu updates automatically with language changes
- **Instant Switching**: No page reloads required

#### 🎯 Translated Components

- **Home Page**: Titles, welcome messages, and navigation
- **Genre Selection**: Instructions and buttons
- **Search**: Placeholders, status messages, and errors
- **Settings**: Language selector and options
- **Navigation**: Hamburger menu with translated elements
- **All Major Pages**: Complete i18n service integration

#### 🛠️ Technical Implementation

```typescript
// I18nService with Angular Signals
export class I18nService {
  private currentLanguage = signal<Language>('es');
  
  setLanguage(lang: Language): void
  t(key: string): string // Translation function
}

// Usage in components
constructor(public i18n: I18nService) {}

// In HTML templates
{{ i18n.t('home.title') }}
{{ i18n.t('nav.search') }}
```

#### 📚 Translation Dictionary

**Navigation**

- `nav.home` → "Inicio" / "Home"
- `nav.search` → "Buscar" / "Search"
- `nav.my-books` → "Mis Libros" / "My Books"
- `nav.settings` → "Configuración" / "Settings"

**Home Page**

- `home.title` → "Gestor de Biblioteca Abierta" / "Open Library Manager"
- `home.welcome` → "Bienvenido a tu Biblioteca" / "Welcome to your Library"
- `home.explore` → "Explora tus géneros favoritos" / "Explore your favorite genres"

**Search**

- `search.title` → "Buscar Libros" / "Search Books"
- `search.placeholder` → "Buscar por título, autor o ISBN..." / "Search by title, author or ISBN..."
- `search.no-results` → "No se encontraron resultados" / "No results found"

**Settings**

- `settings.language` → "Idioma" / "Language"
- `settings.genres` → "Géneros Favoritos" / "Favorite Genres"

**Book Detail Page**

- `book.title` → "Detalle del Libro" / "Book Detail"
- `book.author` → "Autor" / "Author"
- `book.published` → "Publicado" / "Published"
- `book.description` → "Descripción" / "Description"
- `book.subjects` → "Temas" / "Subjects"
- `book.places` → "Lugares" / "Places"
- `book.people` → "Personajes" / "Characters"
- `book.times` → "Épocas" / "Time Periods"

**Pagination**

- `search.loading-more` → "Cargando más libros..." / "Loading more books..."
- `search.book-count` → "libro" / "book" (singular)
- `search.books-count` → "libros" / "books" (plural)

**Common**

- `common.loading` → "Cargando..." / "Loading..."
- `common.error` → "Error" / "Error"
- `common.retry` → "Reintentar" / "Retry"

#### 🔄 Reactive Language Switching

```typescript
// Reactive navigation using Signals
public appPages = computed(() => [
  {title: this.i18n.t('nav.home'), url: '/home'},
  {title: this.i18n.t('nav.search'), url: '/search'},
  // Only affected components re-render when language changes
]);
```

#### 📱 User Experience

1. **Access**: Settings → Language
2. **Selector**: Dropdown with "Español" and "English"
3. **Instant Application**: Immediate change throughout the app
4. **Persistence**: Maintained between sessions

---

## 🏗️ Architecture

### Clean Architecture Implementation

This application implements **Clean Architecture** with strict separation of concerns and offline-first data flow:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │ Components  │  │   State (Signals)   │ │
│  │             │  │             │  │                     │ │
│  │ • Home      │  │ • BookCard  │  │ • BookStateService  │ │
│  │ • Detail    │  │ • Skeleton  │  │ • ListStateService  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Entities   │  │ Use Cases   │  │    Repositories     │ │
│  │             │  │             │  │   (Interfaces)      │ │
│  │ • Book      │  │ • GetBooks  │  │ • BookRepository    │ │
│  │ • Category  │  │ • AddToList │  │ • ListRepository    │ │
│  │ • List      │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Repository  │  │   Services  │  │    Data Sources     │ │
│  │    Impl     │  │             │  │                     │ │
│  │             │  │ • Network   │  │ • OpenLibrary API   │ │
│  │ • BookRepo  │  │ • SQLite    │  │ • SQLite Database   │ │
│  │ • ListRepo  │  │ • Mappers   │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Offline-First Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───▶│ Presentation│───▶│   Domain    │
│  Interaction│    │   Layer     │    │    Layer    │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│                                                             │
│  ┌─────────────┐         ┌─────────────┐                   │
│  │   SQLite    │◀────────│ Repository  │                   │
│  │ (Primary)   │         │    Impl     │                   │
│  └─────────────┘         └─────────────┘                   │
│         │                        │                         │
│         │                        ▼                         │
│         │                ┌─────────────┐                   │
│         │                │  Network    │                   │
│         │                │  Service    │                   │
│         │                └─────────────┘                   │
│         │                        │                         │
│         │                        ▼                         │
│         │                ┌─────────────┐                   │
│         └───────────────▶│ OpenLibrary │                   │
│                          │     API     │                   │
│                          │ (Fallback)  │                   │
│                          └─────────────┘                   │
└─────────────────────────────────────────────────────────────┘

 Flow: SQLite First → API Fallback → Cache Results
```

## 📱 Features

### Core Functionality

- ✅ **Internationalization**: Complete Spanish/English support with instant switching
- ✅ **Book Discovery**: Search OpenLibrary's 20M+ book database
- ✅ **Rich Book Details**: Complete metadata including descriptions, subjects, places, people, and time periods
- ✅ **Offline Reading**: Full functionality without internet connection
- ✅ **Smart Search**: Search by title, author, genre, or ISBN
- ✅ **Infinite Scroll Pagination**: Load more books seamlessly with proper page-based pagination
- ✅ **Custom Lists**: Create and manage up to 3 reading lists
- ✅ **Flexible Data Mapping**: Handles multiple OpenLibrary API response schemas automatically
- ✅ **Genre Selection**: Onboarding with 4 favorite genres
- ✅ **Hamburger Menu**: Navigation between Home, Search, Lists, Settings
- ✅ **Duplicate Prevention**: Business rules enforcement in repositories
- ✅ **Validation**: Maximum 3 lists with comprehensive error handling

### Technical Features

- 🌍 **Internationalization**: Angular Signals-based i18n with Spanish/English support
- 📱 **Reactive State**: Angular Signals for efficient UI updates
- 🎯 **Clean Architecture**: Strict layer separation with dependency inversion
- 💾 **Offline-First**: SQLite database with OpenLibrary API fallback
- 📦 **Standalone Components**: Modern Angular 17+ architecture
- 🔄 **Smart Caching**: Intelligent data synchronization and storage
- 📄 **Pagination System**: Proper page-based pagination with offset calculation for API calls
- 🔀 **Flexible Data Mapping**: Robust mappers handle different JSON schemas (description as string/object, nested authors, multiple cover formats)
- 📚 **Rich Metadata Display**: Complete book information with subjects, places, people, and time periods as color-coded chips
- ⚡ **Performance**: Optimized bundle sizes and lazy loading

### Technologies

- **Framework**: Ionic 7 + Angular 17+
- **Architecture**: Clean Architecture + SOLID Principles
- **Components**: Standalone Components (Angular 17+)
- **State Management**: Angular Signals
- **Internationalization**: Angular i18n with Signals-based reactivity
- **Styling**: SCSS + Ionic CSS Variables
- **Language**: TypeScript (strict mode)
- **Mobile**: Capacitor 8 for hybrid builds
- **Database**: SQLite for local storage
- **API**: OpenLibrary.org integration

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd calidad-cloud-test-ionic
npm install

# Run development server
ionic serve

# Run tests
npm run test:ci

# Build for production
npm run build
```

## 📱 Platform Setup

### Prerequisites

- Node.js 18+
- Ionic CLI: `npm install -g @ionic/cli`
- Capacitor CLI: `npm install -g @capacitor/cli`

### Android Setup

```bash
# Install Capacitor Android
npm install @capacitor/android

# Add Android platform
npx cap add android
```

### iOS Setup

```bash
# Install Capacitor iOS
npm install @capacitor/ios

# Add iOS platform
npx cap add ios
```

### Open Native IDEs

After platform addition, launch the respective native IDEs for final configuration and building:

```bash
# Open Android Studio
npx cap open android

# Open Xcode
npx cap open ios
```

### Build and Sync

```bash
# Build for Android
ionic capacitor build android

# Build for iOS
ionic capacitor build ios
```

## 📊 Testing & Quality Assurance

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests for CI/CD (Chrome Headless)
npm run test:ci
```

### Coverage Report

After running `npm run test:coverage`, open the detailed coverage report:

```bash
# Open coverage report in browser
open coverage/index.html  # macOS
start coverage/index.html # Windows
```

**Current Coverage:**

- **70+ Unit Tests** across all layers including i18n
- **Domain Layer**: 100% - Entity validation and use case logic
- **Data Layer**: 100% - Repository implementations with offline-first validation
- **Presentation Layer**: 100% - Component interactions, Signal updates, and i18n service
- **Internationalization**: 100% - Complete i18n service testing with language switching

### Test Architecture

```
tests/
├── domain/
│   ├── models/*.spec.ts          # Entity validation
│   └── use-cases/*.spec.ts       # Business logic
├── data/
│   ├── repositories/*.spec.ts    # API + SQLite mocks
│   └── mappers/*.spec.ts         # Data transformation
└── presentation/
    ├── components/*.spec.ts      # UI component tests
    ├── services/
    │   └── i18n.service.spec.ts  # Internationalization tests
    └── state/*.spec.ts           # Signal state management
```

## CI/CD Pipeline & GitHub Actions

### Quality Gate

The pipeline starts with a quality gate that runs:

- **Linting**: Code style and quality checks
- **Unit Tests**: Comprehensive test suite in Chrome Headless
- **Build Info**: Generates unique build numbers for artifacts

If quality gate fails, mobile builds are skipped.

### Performance Optimizations

- **Dependency Caching**: npm cache reduces install time by ~60%
- **Gradle Caching**: Android build cache reduces build time by ~30%
- **CocoaPods Caching**: iOS dependency cache improves build speed
- **Parallel Builds**: Gradle parallel execution for faster Android builds

### Artifacts Generated

All artifacts include build numbers for traceability:

1. **Web Build**: `web-build-{buildNumber}`
2. **Android APK**: `android-apk-{buildNumber}`
3. **iOS Archive**: `ios-archive-{buildNumber}`

### Trigger & Scope

Workflow triggers on:

- Push to `develop` or `main` branches
- Pull requests to `develop` or `main` branches

### Pipeline Architecture

#### Workflow Jobs

**1. Quality Gate**

```yaml
quality_gate:
  - Checkout code
  - Setup Node.js with cache
  - Install dependencies
  - Run linting (npm run lint)
  - Run tests (npm run test:ci)
  - Generate build info
```

**2. Web Build**

```yaml
build_web:
  needs: quality_gate
  - Build production web app
  - Upload versioned artifact
```

**3. Android Build**

```yaml
build_android:
  needs: [quality_gate, build_web]
  - Setup Java 21 + Gradle cache
  - Download web artifact
  - Build APK with parallel execution
  - Upload versioned APK
```

**4. iOS Build**

```yaml
build_ios:
  needs: [quality_gate, build_web]
  - Setup Node.js + CocoaPods cache
  - Download web artifact
  - Build iOS archive
  - Upload versioned archive
```

#### Performance Metrics

- **Quality Gate**: ~2-3 minutes
- **Web Build**: ~1-2 minutes
- **Android Build**: ~3-4 minutes (with cache)
- **iOS Build**: ~4-5 minutes (with cache)
- **Total Pipeline**: ~8-12 minutes

#### Cache Keys

- **npm**: `node-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}`
- **Gradle**: `gradle-${{ runner.os }}-${{ hashFiles('**/*.gradle*') }}`
- **CocoaPods**: `pods-${{ runner.os }}-${{ hashFiles('ios/App/Podfile.lock') }}`

## 📊 Project Structure

```
src/app/
├── domain/                    # 🏢 Business Logic Layer
│   ├── models/                # Domain entities
│   │   ├── book.entity.ts      # Book business model
│   │   ├── category.entity.ts  # Category model
│   │   └── custom-list.entity.ts # Reading list model
│   ├── repositories/          # Repository contracts
│   │   ├── book.repository.ts  # Book data interface
│   │   └── list.repository.ts  # List data interface
│   ├── use-cases/             # Business use cases
│   │   ├── get-books-by-genre.use-case.ts
│   │   └── list.use-cases.ts
│   └── tokens/                # DI tokens
│
├── data/                      # 💾 Data Access Layer
│   ├── mappers/               # Data transformation
│   │   └── book.mapper.ts      # API ↔ Entity mapping
│   ├── repositories/          # Repository implementations
│   │   ├── book-repository.impl.ts # Book data access
│   │   └── list-repository.impl.ts # List data access
│   ├── services/              # External services
│   │   ├── network.service.ts  # Network connectivity
│   │   └── sqlite.service.ts   # SQLite database
│   └── sources/               # Data sources
│       ├── open-library.data-source.ts # OpenLibrary API
│       └── open-library.interface.ts   # API contracts
│
└── presentation/              # 🎨 UI Layer
    ├── components/            # Reusable UI components
    │   ├── book-card.component.ts    # Book display card
    │   └── book-skeleton.component.ts # Loading skeleton
    ├── pages/                 # Application pages
    │   ├── home.page.ts        # Main book browser
    │   └── book-detail.page.ts # Book details view
    ├── services/              # Presentation services
    │   ├── i18n.service.ts     # Internationalization service
    │   ├── library-facade.service.ts # UI facade
    │   └── use-case.service.ts      # Use case orchestration
    └── state/                 # State management
        ├── book-state.service.ts    # Book state (Signals)
        └── list-state.service.ts    # List state (Signals)
```

## 🧠 Technical Decisions & Architecture Rationale

### Why Angular Signals?

**Performance Benefits:**

- **Fine-grained Reactivity**: Only affected components re-render when data changes
- **Automatic Dependency Tracking**: No manual subscription management
- **Memory Efficiency**: Automatic cleanup prevents memory leaks
- **Bundle Size**: Smaller than RxJS for simple state management

**Implementation Example:**

```typescript
// Traditional Observable approach
books$ = this.bookService.getBooks().pipe(
  tap(books => this.loading = false),
  catchError(error => this.handleError(error))
);

// Signals approach
books = signal<Book[]>([]);
isLoading = signal<boolean>(false);
hasBooks = computed(() => this.books().length > 0);

// Automatic UI updates when books() changes
```

### Why Clean Architecture?

**Scalability Benefits:**

- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Changes in one layer don't affect others
- **Technology Independence**: Easy to swap implementations
- **Business Logic Protection**: Domain rules isolated from frameworks

**Dependency Flow:**

```
Presentation → Domain ← Data
     │           │        │
   Pages      Use Cases  Repositories
 Components   Entities   Services
   State      Rules      APIs
```

### Why Offline-First?

**User Experience:**

- **Instant Loading**: Data available immediately from SQLite
- **Network Resilience**: App works without internet connection
- **Reduced Data Usage**: Only fetch new data when needed
- **Performance**: Local queries are faster than API calls

**Implementation Strategy:**

1. **Check SQLite first** for existing data
2. **Fallback to API** if data not found or stale
3. **Cache API results** in SQLite for future use
4. **Sync in background** when network available

## 📚 Documentation Index

All project documentation is centralized here:

### 📝 Core Documentation

- **[Internationalization](#-internationalization-i18n)** - Complete bilingual support implementation
- **[Architecture Guide](#-architecture)** - Clean Architecture implementation
- **[Setup Instructions](#-quick-start)** - Getting started
- **[Testing Guide](#-testing--quality-assurance)** - Running tests and coverage
- **[Technical Decisions](#-technical-decisions--architecture-rationale)** - Why we chose our stack

### 🛠️ Development Guides

- **[Project Structure](#-project-structure)** - Codebase organization
- **[Contributing Guidelines](#-contributing)** - Development standards

### 📊 Quality & Performance

- **[Quality Gates](#pipeline-architecture)** - Automated quality checks
- **[Performance Optimizations](#performance-optimizations)** - Build and runtime optimizations
- **[Code Standards](#-development-guidelines)** - SOLID principles implementation

### 📱 Platform Guides

- **[Android Setup](#android-setup)** - Capacitor Android configuration
- **[iOS Setup](#ios-setup)** - Capacitor iOS configuration
- **[Web Deployment](#artifacts-generated)** - Production web builds

---

## 🔧 Development Guidelines

### SOLID Principles Implementation

- **S**ingle Responsibility: Each class has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Derived classes are substitutable
- **I**nterface Segregation: Specific interfaces over general ones
- **D**ependency Inversion: Depend on abstractions, not concretions

### Code Standards

- Use standalone components (Angular 17+)
- Prefer Signals over Observables for local state
- Follow Clean Architecture boundaries strictly
- Implement comprehensive unit tests (aim for 100% coverage)
- Use dependency injection for all services
- TypeScript strict mode enabled

## 🤝 Contributing

1. **Architecture**: Follow Clean Architecture principles
2. **Quality**: Ensure quality gate passes (lint + tests)
3. **Testing**: Write unit tests for all new features
4. **Style**: Follow Angular style guide
5. **Commits**: Use conventional commits
6. **TypeScript**: Use strict mode

## 📜 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using Clean Architecture, Angular Signals, Internationalization, and OpenLibrary API**
