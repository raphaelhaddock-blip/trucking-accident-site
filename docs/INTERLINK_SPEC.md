# Interlinking Architecture Specification

## Overview

This document defines the automated interlinking system that generates contextual internal links between pages, with Google Maps integration for local resources.

---

## Link Graph Data Structure

### Core Interface

```typescript
interface LinkGraph {
  nodes: {
    [pageId: string]: {
      type: 'city' | 'state' | 'accident' | 'blog';
      slug: string;
      state?: string;
      county?: string;
      highways?: string[];
      accidentTypes?: string[];
      population?: number;
      farsData?: {
        fatalities: number;
        years: string;
      };
      mapLinks?: CityMapLinks;
    }
  };
  edges: {
    from: string;
    to: string;
    type: LinkType;
    score: number;
    anchor: string;
    placement: LinkPlacement;
  }[];
}

type LinkType =
  | 'geographic'    // Same state, nearby cities
  | 'corridor'      // Share same highway
  | 'topical'       // Related accident types
  | 'content'       // Contextual blog/resource links
  | 'hierarchical'  // Parent-child (state->city)
  | 'maps';         // Google Maps links

type LinkPlacement =
  | 'intro'         // First paragraph
  | 'body'          // Within content
  | 'section'       // Related section
  | 'footer';       // Bottom navigation
```

### City Map Links Interface

```typescript
interface CityMapLinks {
  // Primary locations
  courthouse: {
    name: string;           // "Essex County Superior Court"
    address: string;        // "465 Dr. Martin Luther King Jr. Blvd, Newark, NJ"
    coordinates: {
      lat: number;
      lng: number;
    };
    googleMapsUrl: string;  // Generated URL
    googleMapsEmbed: string; // Embed URL for iframe
  };

  // Trauma centers (1-3)
  traumaCenters: {
    name: string;           // "University Hospital"
    level: 1 | 2;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    googleMapsUrl: string;
    distanceFromCenter?: string; // "2.3 miles from downtown"
  }[];

  // Highway danger zones
  dangerZones: {
    highway: string;        // "I-95"
    description: string;    // "Exit 14 interchange"
    mileMarkers: string;    // "MM 52-58"
    coordinates: {
      lat: number;
      lng: number;
    };
    googleMapsUrl: string;
  }[];

  // City center (for reference)
  cityCenter: {
    coordinates: {
      lat: number;
      lng: number;
    };
    googleMapsUrl: string;
  };
}
```

---

## Link Scoring Algorithm

### Score Calculation

Each potential link receives a score (0-100) based on multiple factors:

```typescript
interface LinkScore {
  relevance: number;      // 0-40: How related is the content?
  geographic: number;     // 0-20: Physical proximity
  seoValue: number;       // 0-20: Link juice distribution
  userIntent: number;     // 0-20: Likely to help user
}

function calculateLinkScore(from: PageNode, to: PageNode): number {
  let score = 0;

  // Relevance (0-40)
  if (shareHighway(from, to)) score += 25;
  if (sameState(from, to)) score += 10;
  if (shareAccidentType(from, to)) score += 15;
  if (neighboringCounty(from, to)) score += 5;

  // Geographic (0-20)
  const distance = calculateDistance(from.coordinates, to.coordinates);
  if (distance < 25) score += 20;
  else if (distance < 50) score += 15;
  else if (distance < 100) score += 10;
  else if (distance < 200) score += 5;

  // SEO Value (0-20)
  if (to.population > 500000) score += 10;
  else if (to.population > 100000) score += 7;
  else if (to.population > 50000) score += 5;

  if (to.farsData.fatalities > 50) score += 10;
  else if (to.farsData.fatalities > 20) score += 7;
  else if (to.farsData.fatalities > 10) score += 5;

  // User Intent (0-20)
  if (from.type === 'city' && to.type === 'accident') score += 15;
  if (from.type === 'city' && to.type === 'state') score += 10;
  if (from.type === 'city' && to.type === 'city' && shareHighway(from, to)) score += 20;

  return Math.min(100, score);
}
```

### Link Selection

```typescript
interface LinkSelectionConfig {
  cityPage: {
    toState: { count: 1, minScore: 50 };
    toSameStateCities: { count: 6, minScore: 40 };
    toCorridorCities: { count: 3, minScore: 60 };
    toAccidentTypes: { count: 5, minScore: 30 };
    toBlogs: { count: 3, minScore: 30 };
  };
  statePage: {
    toCities: { count: 20, minScore: 30 };
    toNeighborStates: { count: 4, minScore: 40 };
    toAccidentTypes: { count: 10, minScore: 20 };
    toBlogs: { count: 5, minScore: 20 };
  };
  accidentPage: {
    toCities: { count: 10, minScore: 30 };
    toRelatedAccidents: { count: 3, minScore: 50 };
    toBlogs: { count: 3, minScore: 30 };
  };
}
```

---

## Google Maps Integration

### URL Generation

```typescript
// Search URL (opens Google Maps with search query)
function generateMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Directions URL (opens directions to destination)
function generateMapsDirectionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

// Place URL (opens specific place by coordinates)
function generateMapsPlaceUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
}

// Embed URL (for iframe embedding)
function generateMapsEmbedUrl(lat: number, lng: number, zoom: number = 15): string {
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v${Date.now()}`;
}
```

### Map Link Types

#### 1. Courthouse Links

```typescript
interface CourthouseMapLink {
  text: string;           // "Essex County Superior Court"
  href: string;           // Google Maps URL
  icon: 'courthouse';
  schema: {
    "@type": "Courthouse",
    "name": string,
    "address": PostalAddress,
    "geo": GeoCoordinates
  };
}

// Example output:
// <a href="https://www.google.com/maps/search/?api=1&query=Essex+County+Superior+Court+Newark+NJ"
//    target="_blank" rel="noopener" class="map-link courthouse">
//   📍 Essex County Superior Court
// </a>
```

#### 2. Trauma Center Links

```typescript
interface TraumaCenterMapLink {
  text: string;           // "University Hospital (Level 1)"
  href: string;           // Google Maps URL
  icon: 'hospital';
  level: 1 | 2;
  distance?: string;      // "2.3 miles"
  schema: {
    "@type": "Hospital",
    "name": string,
    "address": PostalAddress,
    "medicalSpecialty": "Trauma"
  };
}

// Example output:
// <a href="https://www.google.com/maps/search/?api=1&query=University+Hospital+Newark+NJ"
//    target="_blank" rel="noopener" class="map-link hospital">
//   🏥 University Hospital (Level 1 Trauma) - 2.3 miles
// </a>
```

#### 3. Danger Zone Links

```typescript
interface DangerZoneMapLink {
  text: string;           // "I-95 Exit 14 Interchange"
  href: string;           // Google Maps URL to location
  highway: string;
  mileMarkers: string;
  schema: {
    "@type": "Place",
    "name": string,
    "geo": GeoCoordinates
  };
}

// Example output:
// <a href="https://www.google.com/maps/search/?api=1&query=40.7128,-74.0060"
//    target="_blank" rel="noopener" class="map-link danger-zone">
//   ⚠️ I-95 Exit 14 Interchange (MM 52-58)
// </a>
```

---

## Anchor Text Generation

### Rules

| Link Type | Anchor Text Pattern | Example |
|-----------|-------------------|---------|
| City → State | `{State} truck accident lawyers` | "New Jersey truck accident lawyers" |
| City → City (same state) | `{City} truck accident lawyer` | "Jersey City truck accident lawyer" |
| City → City (corridor) | `truck accidents on {Highway} near {City}` | "truck accidents on I-95 near Philadelphia" |
| City → Accident | `{Type} accidents` | "jackknife accidents" |
| City → Blog | Contextual (varies) | "what to do after a truck crash" |
| State → City | `{City} truck accident lawyer` | "Newark truck accident lawyer" |
| State → Neighbor | `{State} trucking accidents` | "Pennsylvania trucking accidents" |
| Map Links | `{Place Name}` + icon | "📍 Essex County Superior Court" |

### Variation Requirements

```typescript
interface AnchorVariation {
  exact: string[];        // Exact match variations
  phrase: string[];       // Phrase match variations
  partial: string[];      // Partial match variations
  branded: string[];      // Location/branded variations
}

// Example for Newark → Jersey City link:
const anchorVariations: AnchorVariation = {
  exact: [
    "Jersey City truck accident lawyer",
    "Jersey City truck accident attorneys"
  ],
  phrase: [
    "truck accident lawyers in Jersey City",
    "attorneys handling Jersey City truck crashes"
  ],
  partial: [
    "nearby Jersey City",
    "Hudson County attorneys"
  ],
  branded: [
    "Jersey City",
    "Hudson County"
  ]
};

// Selection: Rotate through variations, never use same anchor twice per page
```

---

## Build Process

### Step 1: Parse Content Files

```typescript
async function parseAllContent(): Promise<LinkGraph> {
  const graph: LinkGraph = { nodes: {}, edges: [] };

  // Parse states
  const stateFiles = await glob('src/lib/states-content/*.ts');
  for (const file of stateFiles) {
    const content = await parseStateContent(file);
    graph.nodes[content.slug] = {
      type: 'state',
      slug: content.slug,
      highways: content.majorHighways,
      accidentTypes: content.accidentTypes
    };
  }

  // Parse cities
  const cityFiles = await glob('src/lib/cities-content/**/*.ts');
  for (const file of cityFiles) {
    const content = await parseCityContent(file);
    graph.nodes[`${content.state}/${content.slug}`] = {
      type: 'city',
      slug: content.slug,
      state: content.state,
      county: content.county,
      highways: content.highways,
      accidentTypes: content.accidentTypes,
      population: content.population,
      farsData: content.farsData,
      mapLinks: await generateMapLinks(content)
    };
  }

  // Parse accidents
  const accidentFiles = await glob('src/lib/accidents-content/*.ts');
  for (const file of accidentFiles) {
    const content = await parseAccidentContent(file);
    graph.nodes[content.slug] = {
      type: 'accident',
      slug: content.slug,
      accidentTypes: [content.slug]
    };
  }

  // Parse blogs
  const blogFiles = await glob('src/lib/blog-content/*.ts');
  for (const file of blogFiles) {
    const content = await parseBlogContent(file);
    graph.nodes[`blog/${content.slug}`] = {
      type: 'blog',
      slug: content.slug,
      accidentTypes: content.relatedAccidents
    };
  }

  return graph;
}
```

### Step 2: Extract Relationships

```typescript
async function extractRelationships(graph: LinkGraph): Promise<void> {
  // Geographic relationships
  for (const [id1, node1] of Object.entries(graph.nodes)) {
    for (const [id2, node2] of Object.entries(graph.nodes)) {
      if (id1 === id2) continue;

      // Same state relationship
      if (node1.type === 'city' && node2.type === 'city' &&
          node1.state === node2.state) {
        graph.edges.push({
          from: id1,
          to: id2,
          type: 'geographic',
          score: calculateLinkScore(node1, node2),
          anchor: generateAnchor(node1, node2, 'geographic'),
          placement: 'section'
        });
      }

      // Corridor relationship
      if (node1.highways && node2.highways) {
        const sharedHighways = node1.highways.filter(h =>
          node2.highways?.includes(h)
        );
        if (sharedHighways.length > 0) {
          graph.edges.push({
            from: id1,
            to: id2,
            type: 'corridor',
            score: calculateLinkScore(node1, node2) + 10,
            anchor: generateAnchor(node1, node2, 'corridor', sharedHighways[0]),
            placement: 'body'
          });
        }
      }

      // Hierarchical relationship (state -> city)
      if (node1.type === 'state' && node2.type === 'city' &&
          node2.state === node1.slug) {
        graph.edges.push({
          from: id1,
          to: id2,
          type: 'hierarchical',
          score: 80,
          anchor: generateAnchor(node1, node2, 'hierarchical'),
          placement: 'section'
        });
      }
    }
  }
}
```

### Step 3: Generate Map Data

```typescript
async function generateMapLinks(city: CityContent): Promise<CityMapLinks> {
  const mapLinks: CityMapLinks = {
    courthouse: await lookupCourthouse(city.county, city.state),
    traumaCenters: await lookupTraumaCenters(city.city, city.state),
    dangerZones: await extractDangerZones(city.highways, city.city),
    cityCenter: await getCityCenter(city.city, city.state)
  };

  // Generate Google Maps URLs
  mapLinks.courthouse.googleMapsUrl = generateMapsSearchUrl(
    `${mapLinks.courthouse.name} ${mapLinks.courthouse.address}`
  );

  for (const tc of mapLinks.traumaCenters) {
    tc.googleMapsUrl = generateMapsSearchUrl(
      `${tc.name} ${tc.address}`
    );
  }

  for (const dz of mapLinks.dangerZones) {
    dz.googleMapsUrl = generateMapsPlaceUrl(
      dz.coordinates.lat,
      dz.coordinates.lng,
      `${dz.highway} ${dz.description}`
    );
  }

  return mapLinks;
}
```

### Step 4: Calculate & Select Links

```typescript
async function selectLinks(graph: LinkGraph): Promise<Map<string, SelectedLinks>> {
  const selectedLinks = new Map<string, SelectedLinks>();

  for (const [pageId, node] of Object.entries(graph.nodes)) {
    const config = getLinkConfig(node.type);
    const pageLinks: SelectedLinks = {
      hierarchical: [],
      geographic: [],
      corridor: [],
      topical: [],
      content: [],
      maps: []
    };

    // Get all edges FROM this page
    const outboundEdges = graph.edges
      .filter(e => e.from === pageId)
      .sort((a, b) => b.score - a.score);

    // Select by type according to config
    for (const [linkType, settings] of Object.entries(config)) {
      const typeEdges = outboundEdges
        .filter(e => e.type === linkType && e.score >= settings.minScore)
        .slice(0, settings.count);

      pageLinks[linkType] = typeEdges;
    }

    // Add map links if city page
    if (node.type === 'city' && node.mapLinks) {
      pageLinks.maps = generateMapEdges(node.mapLinks);
    }

    selectedLinks.set(pageId, pageLinks);
  }

  return selectedLinks;
}
```

### Step 5: Generate Link Components

```typescript
async function generateLinkComponents(
  selectedLinks: Map<string, SelectedLinks>
): Promise<void> {
  for (const [pageId, links] of selectedLinks) {
    const component = generateLinkComponent(pageId, links);

    // Write to page-specific interlinks file
    await writeFile(
      `src/lib/interlinks/${pageId}.ts`,
      component
    );
  }
}

function generateLinkComponent(pageId: string, links: SelectedLinks): string {
  return `
// Auto-generated interlinks for ${pageId}
// Do not edit manually - regenerate with: npm run build:interlinks

export const interlinks = {
  state: ${JSON.stringify(links.hierarchical[0] || null)},

  sameStateCities: ${JSON.stringify(links.geographic.slice(0, 6))},

  corridorCities: ${JSON.stringify(links.corridor.slice(0, 3))},

  accidentTypes: ${JSON.stringify(links.topical.slice(0, 5))},

  blogs: ${JSON.stringify(links.content.slice(0, 3))},

  mapLinks: ${JSON.stringify(links.maps)}
};
`;
}
```

---

## Component Output

### Related Cities Component

```tsx
// Generated component for city pages
interface RelatedCitiesProps {
  sameState: CityLink[];
  corridor: CityLink[];
}

export function RelatedCities({ sameState, corridor }: RelatedCitiesProps) {
  return (
    <section className="related-cities">
      <h2>Nearby Truck Accident Resources</h2>

      <div className="same-state">
        <h3>Other {stateName} Cities We Serve</h3>
        <ul>
          {sameState.map(link => (
            <li key={link.slug}>
              <Link href={link.href}>{link.anchor}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="corridor">
        <h3>Along the {highwayName} Corridor</h3>
        <ul>
          {corridor.map(link => (
            <li key={link.slug}>
              <Link href={link.href}>{link.anchor}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

### Map Links Component

```tsx
interface MapLinksProps {
  courthouse: CourthouseMapLink;
  traumaCenters: TraumaCenterMapLink[];
  dangerZones: DangerZoneMapLink[];
}

export function LocalResources({ courthouse, traumaCenters, dangerZones }: MapLinksProps) {
  return (
    <section className="local-resources">
      <h2>Local Resources in {cityName}</h2>

      <div className="courthouse">
        <h3>📍 File Your Lawsuit</h3>
        <a
          href={courthouse.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link"
        >
          {courthouse.name}
        </a>
        <p>{courthouse.address}</p>
      </div>

      <div className="trauma-centers">
        <h3>🏥 Nearest Trauma Centers</h3>
        <ul>
          {traumaCenters.map(tc => (
            <li key={tc.name}>
              <a
                href={tc.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                {tc.name} (Level {tc.level})
              </a>
              {tc.distance && <span> - {tc.distance}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="danger-zones">
        <h3>⚠️ High-Risk Areas</h3>
        <ul>
          {dangerZones.map(dz => (
            <li key={dz.mileMarkers}>
              <a
                href={dz.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                {dz.highway} {dz.description}
              </a>
              <span> ({dz.mileMarkers})</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

---

## Data Sources for Map Links

### Courthouses

| State | Source | Format |
|-------|--------|--------|
| NJ | NJ Courts website | County Superior Court list |
| NY | NY Courts website | County Court list |
| PA | PA Courts website | Common Pleas Court list |
| OH | Ohio Courts website | County Court list |
| FL | FL Courts website | Circuit Court list |

### Trauma Centers

| Source | Data |
|--------|------|
| American College of Surgeons | Verified Trauma Center list |
| State Health Departments | Level I/II designations |
| Hospital websites | Address verification |

### Danger Zones

| Source | Data |
|--------|------|
| State DOT | High-crash corridors |
| FHWA | Freight bottleneck reports |
| NHTSA | Crash location data |

---

## Build Commands

```bash
# Generate full link graph
npm run build:link-graph

# Generate interlinks for all pages
npm run build:interlinks

# Generate map data for cities
npm run build:map-data

# Validate all links (no broken links)
npm run validate:links

# Full rebuild
npm run build:seo
```

---

## Validation

### Link Validation Checklist

- [ ] Every city page has 1 state link
- [ ] Every city page has 6 same-state city links
- [ ] Every city page has 3 corridor city links
- [ ] Every city page has 4-5 accident type links
- [ ] Every city page has 3-5 blog links
- [ ] Every city page has courthouse map link
- [ ] Every city page has 1-3 trauma center map links
- [ ] No broken internal links
- [ ] No orphan pages (pages with 0 inbound links)
- [ ] No over-linked pages (>100 links)
- [ ] Anchor text variation (no exact match >2x)
- [ ] All map URLs are valid Google Maps URLs

### Quality Metrics

| Metric | Target | Maximum |
|--------|--------|---------|
| Links per city page | 15-20 | 30 |
| Links per state page | 40-50 | 60 |
| Orphan pages | 0 | 0 |
| Broken links | 0 | 0 |
| Exact match anchors | <30% | 50% |
