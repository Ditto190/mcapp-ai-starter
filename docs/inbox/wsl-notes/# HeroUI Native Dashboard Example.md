# HeroUI Native Dashboard Example

A comprehensive mobile dashboard built with **HeroUI Native** components, demonstrating best practices for React Native app development with modern UI patterns.

## 🎯 Features

### Dashboard Components Used

- ✅ **Avatar** - User profile with image fallback
- ✅ **Card** - Container components with variants (default, secondary)
- ✅ **Chip** - Status badges and labels with color variants
- ✅ **Button** - Interactive buttons with multiple variants
- ✅ **ScrollShadow** - Horizontal scrollable stats with edge shadows
- ✅ **Tabs** - Navigation between Overview, Projects, and Tasks

### Dashboard Sections

#### 1. Overview Tab

- User profile header with avatar and role
- Performance metrics (scrollable stats cards)
- Recent activity feed
- Clean card-based layout

#### 2. Projects Tab

- Active project cards with status chips
- Progress bars showing completion percentage
- Team size and due date indicators
- Action buttons for details and options

#### 3. Tasks Tab

- Upcoming tasks list with priority badges
- Color-coded priority system (high/medium/low)
- Task completion checkboxes
- Add new task button

## 🚀 Installation

### Prerequisites

```bash
# Required dependencies
npm install heroui-native
npm install expo-linear-gradient
npm install react-native-reanimated
npm install @expo/vector-icons
```

### HeroUI Native Setup

```bash
# Follow the official getting started guide
npx create-heroui-native-app my-dashboard
```

## 📦 Component Breakdown

### HeroUI Native Components Used

#### Avatar

```tsx
<Avatar size="lg" color="accent">
  <Avatar.Image source={{ uri: userData.avatar }} />
  <Avatar.Fallback>DC</Avatar.Fallback>
</Avatar>
```

- **Props**: `size="sm|md|lg"`, `color`, `variant`
- **Subcomponents**: `Avatar.Image`, `Avatar.Fallback`

#### Card

```tsx
<Card variant="secondary">
  <Card.Body className="gap-4">
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Body>
  <Card.Footer className="gap-2">
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

- **Variants**: `default`, `secondary`, `tertiary`, `transparent`
- **Subcomponents**: `Card.Header`, `Card.Body`, `Card.Footer`, `Card.Title`, `Card.Description`

#### Chip

```tsx
<Chip size="sm" variant="soft" color="success">
  <Chip.Label>Active</Chip.Label>
</Chip>
```

- **Sizes**: `sm`, `md`, `lg`
- **Variants**: `primary`, `secondary`, `tertiary`, `soft`
- **Colors**: `accent`, `default`, `success`, `warning`, `danger`

#### Button

```tsx
<Button variant="primary" size="md">
  <Ionicons name="add" size={20} />
  <Button.Label>Add Item</Button.Label>
</Button>
```

- **Variants**: `primary`, `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`
- **Sizes**: `sm`, `md`, `lg`
- **Props**: `isIconOnly` for icon-only buttons

#### ScrollShadow

```tsx
<ScrollShadow LinearGradientComponent={LinearGradient}>
  <ScrollView horizontal>
    {/* Content */}
  </ScrollView>
</ScrollShadow>
```

- Automatically adds gradient shadows at scroll edges
- Required: `LinearGradientComponent` from expo-linear-gradient
- Auto-detects horizontal/vertical orientation

#### Tabs

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} variant="primary">
  <Tabs.List>
    <Tabs.ScrollView>
      <Tabs.Indicator />
      <Tabs.Trigger value="overview">
        <Tabs.Label>Overview</Tabs.Label>
      </Tabs.Trigger>
    </Tabs.ScrollView>
  </Tabs.List>
  <Tabs.Content value="overview">
    {/* Content */}
  </Tabs.Content>
</Tabs>
```

- **Variants**: `primary`, `secondary`
- Animated indicator transitions
- Scrollable tab list support

## 🎨 Design Tokens

### Colors Used

```tsx
// Semantic colors from HeroUI theme
- accent: Primary brand color (purple/blue)
- success: Green for positive states
- warning: Yellow/orange for caution
- danger: Red for critical states
- default: Neutral gray
- muted: Lighter text for secondary info
```

### Layout Patterns

```tsx
// Consistent spacing with Tailwind classes
gap-2   // 8px - tight spacing
gap-3   // 12px - default spacing
gap-4   // 16px - comfortable spacing
gap-6   // 24px - section spacing

// Padding
p-5     // 20px - standard screen padding
px-1    // 4px - minimal horizontal padding
```

## 🔧 Customization

### Modifying Stats Data

```tsx
const statsData = [
  { 
    id: 1, 
    label: 'Your Metric', 
    value: '99', 
    change: '+15%', 
    trend: 'up' 
  },
  // Add more stats...
];
```

### Adding New Tabs

```tsx
// In Tabs.List
<Tabs.Trigger value="newTab">
  <Ionicons name="analytics-outline" size={16} />
  <Tabs.Label>Analytics</Tabs.Label>
</Tabs.Trigger>

// In content area
<Tabs.Content value="newTab">
  {renderAnalyticsTab()}
</Tabs.Content>
```

### Custom Color Schemes

```tsx
// For chips and status indicators
const getCustomColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    default: return 'default';
  }
};
```

## 📱 Responsive Design

The dashboard uses:

- **Uniwind** (Tailwind CSS for React Native) for utility-first styling
- Flexible layouts with `flex-1`, `flex-row`, `gap-*`
- ScrollViews for overflowing content
- Card-based responsive grid

## 🎭 Animations

### Built-in Animations

- **Tabs**: Smooth indicator transitions (spring animation)
- **Cards**: Fade in/out on tab changes (FadeIn/FadeOut)
- **ScrollShadow**: Gradient opacity on scroll

### Animation Configuration

```tsx
// Tabs with custom animation
<Tabs.Indicator
  animation={{
    width: { type: 'spring', config: { stiffness: 1200 } },
    translateX: { type: 'timing', config: { duration: 200 } }
  }}
/>
```

## 💡 Best Practices

1. **Use semantic variants**: Choose `variant="primary"` for main actions, `variant="secondary"` for less prominent elements

2. **Consistent spacing**: Use the gap utilities (`gap-2`, `gap-4`) for uniform spacing

3. **Color coding**: Use color props consistently for status (`success`, `warning`, `danger`)

4. **Accessibility**: Include proper icon names from Ionicons for screen readers

5. **Performance**: Use `ScrollView` with `showsHorizontalScrollIndicator={false}` for cleaner mobile UX

## 🔗 Resources

- [HeroUI Native Docs](https://v3.heroui.com/docs/native)
- [HeroUI GitHub](https://github.com/heroui-inc/heroui-native)
- [Expo Icons](https://icons.expo.fyi/)
- [Tailwind (Uniwind) Docs](https://tailwindcss.com/docs)

## 📊 Component Hierarchy

```
Dashboard
├── Header (fixed)
│   ├── Title + Date
│   └── Notification Button
├── Tabs Navigation
│   ├── Overview Tab
│   │   ├── Profile Card (Avatar + User Info)
│   │   ├── Stats Scroll (ScrollShadow + Cards)
│   │   └── Activity Feed (Cards)
│   ├── Projects Tab
│   │   └── Project Cards (with progress bars)
│   └── Tasks Tab
│       ├── Summary Card
│       ├── Task Cards (with checkboxes)
│       └── Add Task Button
```

## 🎓 Learning Points

This dashboard demonstrates:

- ✅ Compound component patterns (Card.Body, Avatar.Image, etc.)
- ✅ State management with React hooks
- ✅ Conditional rendering based on data
- ✅ Color theming with semantic tokens
- ✅ Animation composition
- ✅ Responsive layouts with Tailwind utilities
- ✅ Component composition and reusability

---

**Built with HeroUI Native v1.0.2** 🚀
