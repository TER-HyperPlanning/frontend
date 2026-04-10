# Table UI Standardization Summary

## Overview
All table components across the application have been standardized to use a consistent, modern design system. This ensures visual and functional uniformity across all pages.

## Changes Made

### 1. Base Table Component (`src/components/Table.tsx`)
**Updated styling from DaisyUI to a custom, modern design**

**New Features:**
- Clean, light card-based design with rounded corners
- Gradient header with subtle background
- Consistent padding and spacing (py-3 px-4)
- Smooth hover effects on rows
- Professional borders and shadows
- Better typography with proper font weights and colors

### 2. New Utilities File (`src/utils/tableStyles.ts`)
**Created centralized styling constants for consistency**

**Exported:**
- `BADGE_STYLES` - Badge variants for different statuses (active, inactive, warning, error, info, secondary, + outlined variants)
- `ACTION_BUTTON_STYLES` - Consistent hover styles for action buttons (edit, delete, view, assign, primary)
- `TEXT_STYLES` - Typography utilities (label, muted, faded, code)
- `EMPTY_STATE_STYLES` - Empty state container and message styling
- `EmptyState` - Reusable empty state component

### 3. Updated Table Components

#### FormationsTable (`src/components/formations/FormationsTable.tsx`)
- ✅ New unified table styling
- ✅ Uses `BADGE_STYLES['secondary-outline']` for program codes
- ✅ Uses `BADGE_STYLES['info-outline']` for filière names
- ✅ Switched from heroicons to lucide-react icons (Pencil, Trash2)
- ✅ Consistent action buttons using `ACTION_BUTTON_STYLES`
- ✅ Proper empty state with `EmptyState` component
- ✅ Right-aligned action column

#### TeachersTable (`src/components/teachers/TeachersTable.tsx`)
- ✅ Updated to use lucide-react icons (Pencil, Trash2)
- ✅ Dynamic badge colors based on status (active, warning, secondary)
- ✅ Consistent action buttons using `ACTION_BUTTON_STYLES`
- ✅ Proper empty state with `EmptyState` component
- ✅ Right-aligned action column

#### ScolariteTable (`src/components/scolarite/ScolariteTable.tsx`)
- ✅ Updated to use `BADGE_STYLES['info-outline']` for filières
- ✅ Consistent action buttons for assign and edit
- ✅ Proper empty state with `EmptyState` component
- ✅ Right-aligned action column

#### ModuleTable (`src/components/modules/ModuleTable.tsx`)
- ✅ Updated to use `BADGE_STYLES['secondary-outline']` for codes
- ✅ Consistent action buttons using `ACTION_BUTTON_STYLES`
- ✅ Proper empty state with `EmptyState` component
- ✅ Right-aligned action column

#### RoomsTable (`src/components/modals/RoomsTable.tsx`)
- ✅ Updated to use lucide-react icons (Pencil, Trash2)
- ✅ Dynamic badge colors for room types
- ✅ Bag style for capacity information
- ✅ Consistent action buttons using `ACTION_BUTTON_STYLES`
- ✅ Proper empty state with `EmptyState` component
- ✅ Right-aligned action column

#### GroupTable (`src/features/groupes/components/GroupTable.tsx`)
- ✅ Updated badge styling with `BADGE_STYLES`
- ✅ Improved capacity progress bar with color coding
- ✅ Better percentage display
- ✅ Consistent layout with other tables

## Design System Features

### Badges
All badges now follow a consistent style with:
- Proper padding and rounded corners (rounded-full)
- Semantic color coding:
  - **Active/Success**: Emerald green
  - **Warning**: Amber
  - **Error**: Red
  - **Info**: Blue
  - **Secondary**: Purple
  - **Inactive**: Gray
- Outlined variants for less prominent information

### Action Buttons
All action buttons now use consistent styling:
- **Edit**: Amber hover color with subtle background
- **Delete/Remove**: Red hover color with subtle background
- **View/Link**: Blue hover color with subtle background
- **Assign**: Green hover color with subtle background
- Smooth transitions on hover
- Proper icon sizing (16px)

### Typography
- Headers: Uppercase, semibold, gray-700
- Primary content: Semibold, gray-900
- Secondary content: Regular, gray-600
- Muted content: Regular, gray-400 or gray-500

### Empty States
All tables now show consistent empty state messages with:
- Centered layout
- Icon support (optional)
- Title and message text
- Consistent spacing

## Icon Library
**Standardized on Lucide Icons** across all tables:
- `Pencil` for edit actions
- `Trash2` for delete actions
- `Link2` for assign/link actions
- `UserPlus` for user assignment actions

## Responsive Design
- Tables are wrapped in scrollable containers for mobile
- All text uses consistent sizing
- Action buttons remain accessible on small screens

## Files Modified
1. `src/components/Table.tsx` - Base component styling
2. `src/utils/tableStyles.ts` - New styling utilities
3. `src/components/formations/FormationsTable.tsx`
4. `src/components/teachers/TeachersTable.tsx`
5. `src/components/scolarite/ScolariteTable.tsx`
6. `src/components/modules/ModuleTable.tsx`
7. `src/components/modals/RoomsTable.tsx`
8. `src/features/groupes/components/GroupTable.tsx`

## Usage Guidelines

### For Create New Tables
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'

// Use badges from BADGE_STYLES
<span className={BADGE_STYLES.active}>Active</span>

// Use action buttons from ACTION_BUTTON_STYLES
<button className={ACTION_BUTTON_STYLES.edit}>Edit</button>

// Use empty state component
<EmptyState title="No items" message="No items found" />
```

### For Updating Existing Tables
1. Import utilities from `@/utils/tableStyles`
2. Replace hardcoded badge classes with `BADGE_STYLES` constants
3. Replace hardcoded button classes with `ACTION_BUTTON_STYLES` constants
4. Replace custom empty states with `EmptyState` component
5. Switch icon libraries to Lucide if not already done
6. Right-align action columns for consistency
