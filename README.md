# Contentful Personalization with Ninetailed

A Next.js application demonstrating Contentful content personalization using Ninetailed's Experience.js SDK. This setup allows you to create personalized content experiences based on user traits and behaviors.

## Features

- **Contentful Integration**: Fetch blog posts and personalized sidebar content via GraphQL
- **Ninetailed Personalization**: A/B testing and personalized content delivery
- **Rich Text Support**: Contentful Rich Text with inline merge tags for dynamic content
- **TypeScript**: Full type safety across the application
- **User Traits**: Track and use user attributes for personalization

## Tech Stack

- **Next.js 15** with Turbopack
- **Contentful** (CMS + GraphQL API)
- **Ninetailed Experience.js** (Personalization SDK)
- **TypeScript**
- **React 18**

## Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_CDA_TOKEN=your_cda_token
CONTENTFUL_ENVIRONMENT=master

# Ninetailed Configuration
NEXT_PUBLIC_NINETAILED_CLIENT_ID=your_ninetailed_client_id
```

## Installation

```bash
npm install
npm run dev
```

## Contentful Content Model Setup

### 1. Blog Post Content Type

Create a content type called `BlogPost` with these fields:

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `title` | Title | Short text | Yes | - |
| `slug` | Slug | Short text | Yes | Unique |
| `body` | Body | Short text | No | - |
| `sideBar` | Sidebar | Reference | No | Single reference to `BlogPostSideBar` |

### 2. Blog Post Sidebar Content Type

Create a content type called `BlogPostSideBar` with these fields:

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `title` | Title | Short text | No | - |
| `content` | Content | Short text | No | - |
| `bodyContent` | Rich Content | Rich text | No | - |
| `ntExperiencesCollection` | Ninetailed Experiences | Reference | No | Many references to `NtExperience` |

### 3. Ninetailed Experience Content Type

Create a content type called `NtExperience` with these fields:

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `ntExperienceId` | Experience ID | Short text | Yes | Unique |
| `ntName` | Experience Name | Short text | Yes | - |
| `ntType` | Experience Type | Short text | Yes | - |
| `ntConfig` | Configuration | JSON object | No | - |
| `ntAudience` | Audience | Reference | No | Single reference to `NtAudience` |
| `ntVariantsCollection` | Variants | Reference | No | Many references to `BlogPostSideBar` |

### 4. Ninetailed Audience Content Type

Create a content type called `NtAudience` with these fields:

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `ntAudienceId` | Audience ID | Short text | Yes | Unique |
| `ntName` | Audience Name | Short text | Yes | - |

### 5. Ninetailed Merge Tag Content Type

Create a content type called `NtMergetag` with these fields:

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `_id` | ID | Short text | Yes | - |
| `ntMergetagId` | Merge Tag ID | Short text | Yes | - |
| `ntName` | Merge Tag Name | Short text | Yes | - |
| `ntFallback` | Fallback Text | Short text | No | - |

## Content Setup Examples

### Creating a Blog Post

1. Create a `BlogPost` entry with:
   - Title: "Getting Started with React"
   - Slug: "getting-started-react"
   - Body: "This is a comprehensive guide to React development..."
   - Sidebar: Reference to a `BlogPostSideBar` entry

### Creating Personalized Sidebar Content

1. Create a `BlogPostSideBar` entry with:
   - Title: "Related Resources"
   - Content: "Check out these helpful resources"
   - Rich Content: Include merge tags like "Hello {{traits.username}}!" for personalization

### Setting Up Experiences

1. Create an `NtExperience` entry with:
   - Experience ID: "sidebar-personalization"
   - Experience Name: "Sidebar Personalization"
   - Experience Type: "personalization"
   - Configuration: `{"traits": ["level", "username"]}`
   - Audience: Reference to audience targeting specific user traits
   - Variants: Multiple `BlogPostSideBar` entries for different user segments

### Creating Audiences

1. Create an `NtAudience` entry with:
   - Audience ID: "beginner-developers"
   - Audience Name: "Beginner Developers"
   - Configure audience rules in Ninetailed dashboard to target users with `level: "beginner"`

### Using Merge Tags

In Rich Text content, embed `NtMergetag` entries to create dynamic content:
- Merge Tag ID: "username"
- Fallback: "there"
- This creates personalized greetings like "Hello Roger!" when username trait is set

## Key Components

### `usePersonalization` Hook

Custom hook providing personalization functionality:

```typescript
const { setTraits, getTrait, getProfileState } = usePersonalization<{
  level: "beginner" | "advanced";
  username: string;
}>();
```

### `Experience` Component

Wraps components with personalization logic:

```typescript
<Experience experiences={ntExperiences} component={BlogSidebar} {...sidebar} />
```

### `MergeTag` Component

Renders dynamic content based on user traits:

```typescript
<MergeTag id="traits.username" fallback="there" />
```

## Usage Flow

1. **User Visits Page**: `getServerSideProps` fetches blog post and experiences
2. **Traits Set**: Component sets user traits (level, username, etc.)
3. **Experience Evaluation**: Ninetailed evaluates experiences against user traits
4. **Content Delivery**: Personalized sidebar content is rendered
5. **Tracking**: User interactions are tracked for analytics

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## File Structure

```
├── components/
│   ├── BlogSidebar.tsx          # Personalized sidebar component
│   └── LevelSelect.tsx          # User level selector
├── lib/
│   ├── blogRepo.ts              # Blog post fetching logic
│   ├── contentfulGql.ts         # GraphQL client setup
│   ├── experience/
│   │   └── map.ts               # Experience mapping utilities
│   ├── gql/
│   │   └── fragments.ts         # GraphQL fragments
│   ├── types/
│   │   ├── blog.ts              # Blog-related types
│   │   └── contentful.ts        # Contentful types
│   ├── usePersonalization.ts    # Personalization hook
│   └── richText.tsx             # Rich text rendering with merge tags
├── pages/
│   ├── _app.tsx                 # App wrapper with Ninetailed provider
│   └── blog/
│       └── [slug].tsx           # Blog post page
└── styles/
    └── globals.css              # Global styles
```

## Personalization Examples

### User Level-Based Content
- Beginner users see simplified sidebar content
- Advanced users see technical resources and complex topics

### Name Personalization
- Dynamic greetings using merge tags
- Personalized recommendations based on user profile

### Behavioral Targeting
- Content changes based on user interactions
- Progressive disclosure based on engagement level

## Troubleshooting

1. **Missing Environment Variables**: Ensure all required env vars are set
2. **Contentful API Issues**: Verify space ID, token, and environment settings
3. **Ninetailed Not Working**: Check client ID and ensure experiences are properly configured
4. **Rich Text Not Rendering**: Verify merge tag entries are properly linked in Contentful

## Next Steps

- Add more sophisticated audience targeting
- Implement user journey tracking
- Create more complex personalization rules
- Add analytics dashboard integration
- Implement multivariate testing capabilities#   p e r s o n a l i s a t i o n _ a p p  
 