# Landing Page API Hooks

This directory contains React Query hooks for fetching data needed on the landing page.

## Physician Hooks (`usePhysicians.ts`)

### `usePublicPhysicians(params?)`

Fetches public physician data with optional filtering.

```typescript
const { data: physicians, isLoading } = usePublicPhysicians({ limit: 8 });

// Response structure:
{
  success: boolean;
  data: {
    physicians: ExpertPhysician[]; // Uses ExpertPhysician from @/types/landing
    total: number;
    page: number;
    limit: number;
  }
}
```

### `useTopRatedPhysicians(limit?)`

Fetches top-rated physicians (default limit: 10).

```typescript
const { data: topRated } = useTopRatedPhysicians(6);
```

### `usePhysicianStatistics()`

Fetches overall physician statistics.

```typescript
const { data: stats } = usePhysicianStatistics();

// Response structure:
{
  success: boolean;
  data: LandingPageStats; // Uses LandingPageStats from @/types/landing
}
```

## Review Hooks (`useReviews.ts`)

### `useFeaturedReviews(limit?)`

Fetches featured reviews (top-rated, default limit: 6).

```typescript
const { data: reviews } = useFeaturedReviews(6);
```

### `useReviewsStatistics()`

Fetches review statistics and rating distribution.

```typescript
const { data: reviewStats } = useReviewsStatistics();
```

## Usage in Components

```typescript
import {
  usePublicPhysicians,
  useTopRatedPhysicians,
  usePhysicianStatistics,
  useFeaturedReviews,
  useReviewsStatistics,
} from '@/hooks';

function LandingPage() {
  const { data: physicians, isLoading } = usePublicPhysicians({ limit: 8 });
  const { data: topRated } = useTopRatedPhysicians(6);
  const { data: stats } = usePhysicianStatistics();
  const { data: reviews } = useFeaturedReviews(6);
  const { data: reviewStats } = useReviewsStatistics();

  // Use the data in your components...
}
```

## Types Used

The hooks use the following types from `@/types/landing`:

- `ExpertPhysician` - Physician data structure
- `LandingPageStats` - Statistics for the landing page
- `Reviews` - Review data structure

## API Endpoints

- `GET /physician/public` - Public physician listings
- `GET /physician/top-rated` - Top-rated physicians
- `GET /physician/statistics` - Physician statistics
- `GET /reviews` - Reviews with filtering
- `GET /reviews/statistics` - Review statistics

## Caching Strategy

- **Public Physicians**: 5 minutes stale time
- **Top Rated Physicians**: 10 minutes stale time
- **Physician Statistics**: 15 minutes stale time
- **Reviews**: 5 minutes stale time
- **Review Statistics**: 15 minutes stale time

All hooks include automatic error handling and retry logic through React Query.
